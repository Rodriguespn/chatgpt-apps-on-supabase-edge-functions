#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env

/**
 * MCP Server for Fridge Widget
 *
 * This server exposes tools that return UIResources containing the fridge widget.
 * Uses HTTP streamable transport.
 */

import { Hono } from 'hono';
import { serveStatic } from 'hono/deno';
import { cors } from 'hono/cors';
import type { Context } from 'hono';
import { McpServer, StreamableHttpTransport } from 'mcp-lite';
import { z } from 'zod';
import { handleFridgeWidget, handleFridgeWidgetResource, handleAddItem } from './tools/fridgeWidget.ts';

// Create the MCP server using mcp-lite
export const server = new McpServer({
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

// Create Hono app
const app = new Hono();

// Add CORS middleware
app.use('*', cors());

// Serve static files with proper MIME types
app.use('/static/*', serveStatic({
  root: './',
  rewriteRequestPath: (path: string) => path.replace(/^\/static/, '/static')
}));

// Health check endpoint
app.get('/health', (c: Context) => {
  return c.json({ status: 'ok', server: 'fridge-widget-mcp' });
});

// Test endpoint to view the widget HTML directly in browser
app.get('/test-widget', async (c: Context) => {
  const { getWidgetHTML } = await import('./tools/fridgeWidget.ts');
  const html = getWidgetHTML();
  return c.html(html);
});

// MCP endpoint using StreamableHTTP transport from mcp-lite
const transport = new StreamableHttpTransport();
const mcpHandler = transport.bind(server);

app.all('/mcp', async (c: Context) => {
  console.error('New MCP request received');

  // Hono's request is already a standard Request object
  const request = c.req.raw;

  // Handle with mcp-lite
  const response = await mcpHandler(request);

  // Return the response directly - Hono will handle streaming
  return response;
});

// Start the server
const PORT = Number(Deno.env.get('PORT')) || 3000;

Deno.serve({ port: PORT }, app.fetch);

console.error(`Fridge Widget MCP Server running on http://localhost:${PORT}`);
console.error(`MCP endpoint: http://localhost:${PORT}/mcp`);
console.error(`Health check: http://localhost:${PORT}/health`);
