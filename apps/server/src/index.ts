#!/usr/bin/env node

/**
 * MCP Server for Fridge Widget
 *
 * This server exposes tools that return UIResources containing the fridge widget.
 * Uses HTTP streamable transport.
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { handleFridgeWidget, handleFridgeWidgetResource, handleAddItem } from './tools/fridgeWidget.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the MCP server
const server = new Server(
  {
    name: 'fridge-widget-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'show_fridge',
        description: 'Display the contents of the fridge stored on the server in an interactive widget',
        inputSchema: {
          type: 'object',
          properties: {},
        },
        _meta: { "openai/outputTemplate": "ui://fridge-widget" },
      },
      {
        name: 'add_fridge_item',
        description: 'Add a new item to the fridge inventory',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the item to add',
            },
            category: {
              type: 'string',
              enum: ['dairy', 'meat', 'seafood', 'vegetables', 'fruits', 'beverages', 'condiments', 'leftovers', 'eggs', 'bakery', 'frozen', 'other'],
              description: 'Category of the item',
            },
            quantity: {
              type: 'number',
              description: 'Quantity value (must be positive)',
              minimum: 0,
            },
            unit: {
              type: 'string',
              enum: ['count', 'g', 'kg', 'ml', 'l', 'oz', 'lb', 'package', 'container'],
              description: 'Unit of measurement',
            },
            zoneId: {
              type: 'string',
              description: 'Optional zone ID where the item should be stored (defaults based on category)',
            },
            expirationDate: {
              type: 'string',
              format: 'date-time',
              description: 'ISO 8601 datetime when the item expires (optional)',
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the item (optional)',
            },
            barcode: {
              type: 'string',
              description: 'Product barcode (optional)',
            },
          },
          required: ['name', 'category', 'quantity', 'unit'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'show_fridge') {
    return await handleFridgeWidget();
  }

  if (name === 'add_fridge_item') {
    return await handleAddItem(args as any);
  }

  throw new Error(`Unknown tool: ${name}`);
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'ui://fridge-widget',
        name: 'Fridge Widget',
        description: 'Interactive widget displaying fridge contents',
        mimeType: 'text/html+skybridge',
      },
    ],
  };
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'ui://fridge-widget') {
    return await handleFridgeWidgetResource();
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Create Express app
const app = express();
app.use(express.json());

// Serve static files (adapter script) with proper MIME types and CORS headers
app.use('/static', express.static(join(__dirname, '../static'), {
  setHeaders: (res, path) => {
    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Set proper MIME types
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    }
  }
}));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', server: 'fridge-widget-mcp' });
});

// MCP endpoint using StreamableHTTP transport
app.post('/mcp', async (req, res) => {
  console.error('New MCP request received');

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.error(`Fridge Widget MCP Server running on http://localhost:${PORT}`);
  console.error(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.error(`Health check: http://localhost:${PORT}/health`);
});
