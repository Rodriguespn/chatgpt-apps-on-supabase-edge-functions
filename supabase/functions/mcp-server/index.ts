/**
 * Supabase Edge Function for MCP Fridge Widget Server
 *
 * This implementation uses the `supabase-mcp-handler` helper to wire up
 * the MCP HTTP endpoints (/mcp, /health) and CORS, while we register tools
 * and resources directly on the underlying mcp-lite server instance.
 */

import { createEdgeMCPServer } from '@rodriguespn/supabase-mcp-handler';
// Import server modules (tool/resource handlers)
import {
  handleAddItem,
  handleFridgeWidget,
  handleFridgeWidgetResource,
} from './server/tools/fridgeWidget.ts';
import type { ItemCategory, QuantityUnit } from './server/types/fridge.ts';

// Initialize the MCP server and request handler for Deno.serve
const { server, serve } = createEdgeMCPServer({
  name: 'fridge-widget-server',
  basePath: '/mcp-server',
  version: '1.0.0',
  // CORS is enabled by default; customize origins if needed, e.g. corsOrigins: ["*"]
  enableLogging: true,
});

// Define tool: show_fridge (no input parameters)
server.tool('show_fridge', {
  description: 'Display the contents of the fridge stored on the server in an interactive widget',
  inputSchema: {
    type: 'object',
    properties: {},
  },
  _meta: { 'openai/outputTemplate': 'ui://fridge-widget' },
  handler: async () => {
    // deno-lint-ignore no-explicit-any
    return await handleFridgeWidget() as any;
  },
});

// Define tool: add_fridge_item (JSON Schema to avoid zod dependency)
const AddFridgeItemSchemaJson = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Name of the item to add' },
    category: {
      type: 'string',
      enum: [
        'dairy',
        'meat',
        'seafood',
        'vegetables',
        'fruits',
        'beverages',
        'condiments',
        'leftovers',
        'eggs',
        'bakery',
        'frozen',
        'other',
      ],
      description: 'Category of the item',
    },
    quantity: {
      type: 'number',
      exclusiveMinimum: 0,
      description: 'Quantity value (must be positive)',
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
    notes: { type: 'string', description: 'Additional notes about the item (optional)' },
    barcode: { type: 'string', description: 'Product barcode (optional)' },
  },
  required: ['name', 'category', 'quantity', 'unit'],
  additionalProperties: false,
} as const;

server.tool('add_fridge_item', {
  description: 'Add a new item to the fridge inventory',
  inputSchema: AddFridgeItemSchemaJson,
  handler: async (args: {
    name: string;
    category: ItemCategory;
    quantity: number;
    unit: QuantityUnit;
    zoneId?: string;
    expirationDate?: string;
    notes?: string;
    barcode?: string;
  }) => {
    // deno-lint-ignore no-explicit-any
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
    // deno-lint-ignore no-explicit-any
    return await handleFridgeWidgetResource() as any;
  },
);

// One-line deployment to Supabase Edge Functions
Deno.serve(serve());
