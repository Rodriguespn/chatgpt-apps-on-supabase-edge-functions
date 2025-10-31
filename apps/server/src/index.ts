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
import { McpServer, StreamableHttpTransport } from 'mcp-lite';
import { z } from 'zod';
import { handleFridgeWidget, handleFridgeWidgetResource, handleAddItem } from './tools/fridgeWidget.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the MCP server using mcp-lite
const server = new McpServer({
  name: 'fridge-widget-server',
  version: '1.0.0',
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType),
});

// Define tool: show_fridge
server.tool('show_fridge', {
  description: 'Display the contents of the fridge stored on the server in an interactive widget',
  inputSchema: z.object({}),
  _meta: { "openai/outputTemplate": "ui://fridge-widget" },
  handler: async () => {
    return await handleFridgeWidget() as any;
  },
});

// Define tool: add_fridge_item
const AddFridgeItemSchema = z.object({
  name: z.string().describe('Name of the item to add'),
  category: z.enum(['dairy', 'meat', 'seafood', 'vegetables', 'fruits', 'beverages', 'condiments', 'leftovers', 'eggs', 'bakery', 'frozen', 'other']).describe('Category of the item'),
  quantity: z.number().positive().describe('Quantity value (must be positive)'),
  unit: z.enum(['count', 'g', 'kg', 'ml', 'l', 'oz', 'lb', 'package', 'container']).describe('Unit of measurement'),
  zoneId: z.string().optional().describe('Optional zone ID where the item should be stored (defaults based on category)'),
  expirationDate: z.string().datetime().optional().describe('ISO 8601 datetime when the item expires (optional)'),
  notes: z.string().optional().describe('Additional notes about the item (optional)'),
  barcode: z.string().optional().describe('Product barcode (optional)'),
});

server.tool('add_fridge_item', {
  description: 'Add a new item to the fridge inventory',
  inputSchema: AddFridgeItemSchema,
  handler: async (args) => {
    return await handleAddItem(args) as any;
  },
});

// Define resource: fridge-widget
server.resource(
  'ui://fridge-widget',
  {
    name: 'Fridge Widget',
    description: 'Interactive widget displaying fridge contents',
    mimeType: 'text/html+skybridge',
  },
  async () => {
    return await handleFridgeWidgetResource() as any
  }
);

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

// Test endpoint to view the widget HTML directly in browser
app.get('/test-widget', (_req, res) => {
  const { getWidgetHTML } = require('./tools/fridgeWidget.js');
  const html = getWidgetHTML();
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// MCP endpoint using StreamableHTTP transport from mcp-lite
const transport = new StreamableHttpTransport();
const mcpHandler = transport.bind(server);

app.all('/mcp', async (req: any, res: any) => {
  console.error('New MCP request received');
  
  // Convert Express request to standard Request object
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });
  
  // Handle with mcp-lite
  const response = await mcpHandler(request);
  
  // Copy headers from response
  response.headers.forEach((value: string, key: string) => {
    res.setHeader(key, value);
  });
  
  // Set status
  res.status(response.status);
  
  // Stream the response body
  if (response.body) {
    const reader = response.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  }
  
  res.end();
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.error(`Fridge Widget MCP Server running on http://localhost:${PORT}`);
  console.error(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.error(`Health check: http://localhost:${PORT}/health`);
});
