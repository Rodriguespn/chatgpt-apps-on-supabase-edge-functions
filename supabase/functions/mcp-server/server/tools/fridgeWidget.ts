/**
 * Fridge Widget Tool
 *
 * This tool returns a UIResource containing the embedded React widget
 * that displays fridge contents stored on the server.
 */

import { createUIResource, getAppsSdkAdapterScript } from 'npm:@mcp-ui/server@5.12.0-alpha.5';
import type { UIResource } from 'npm:@mcp-ui/server@5.12.0-alpha.5';
import type { FridgeData, FridgeItem, ItemStatus, ItemCategory, QuantityUnit } from '../types/fridge.ts';
import { mockFridgeData } from '../data/mockFridgeData.ts';
import { dirname, join } from 'jsr:@std/path@^1.0.8';

const __dirname = dirname(new URL(import.meta.url).pathname);

/**
 * Calculate item status based on expiration date
 */
function calculateItemStatus(expirationDate?: string): ItemStatus {
  if (!expirationDate) {
    return 'fresh';
  }

  const now = new Date();
  const expiration = new Date(expirationDate);
  const daysUntilExpiration = Math.floor((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) {
    return 'expired';
  } else if (daysUntilExpiration <= 3) {
    return 'expiring-soon';
  } else {
    return 'fresh';
  }
}

/**
 * Loads the widget HTML and injects the adapter script
 * Data will be provided by the adapter layer via toolOutput prop
 * Widget assets (JS/CSS) are embedded inline
 */
export function getWidgetHTML(): string {
  // Get the built-in adapter script from @mcp-ui/server
  const adapterScript = getAppsSdkAdapterScript();

  // Read the built widget files from widget/dist/
  // For edge functions, the path is relative to the function root
  const widgetDistPath = join(__dirname, '../../widget/dist');

  let widgetCSS = '';
  let widgetJS = '';

  try {
    widgetCSS = Deno.readTextFileSync(join(widgetDistPath, 'style.css'));
    console.error('[getWidgetHTML] Loaded style.css from', join(widgetDistPath, 'style.css'));
    console.error('[getWidgetHTML] CSS length:', widgetCSS.length);
  } catch (error) {
    console.error('[getWidgetHTML] Failed to load style.css:', error);
  }

  try {
    widgetJS = Deno.readTextFileSync(join(widgetDistPath, 'index.js'));
    console.error('[getWidgetHTML] Loaded index.js from', join(widgetDistPath, 'index.js'));
    console.error('[getWidgetHTML] JS length:', widgetJS.length);
    // Check if the new log is present
    if (widgetJS.includes('Setting up ResizeObserver for appRef')) {
      console.error('[getWidgetHTML] ✓ Found new ResizeObserver log in widget code');
    } else {
      console.error('[getWidgetHTML] ✗ ResizeObserver log NOT found - old version loaded?');
    }
  } catch (error) {
    console.error('[getWidgetHTML] Failed to load index.js:', error);
  }

  // Build HTML with inline assets
  const widgetHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fridge Widget</title>
    <style>
      ${widgetCSS}
    </style>
    <script>
      ${adapterScript}
    </script>
    <script type="module">
      ${widgetJS}
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  console.error('[getWidgetHTML] Generated HTML with inline assets');

  return widgetHTML;
}

/**
 * Tool handler for the fridge widget
 * Returns the fridge data stored on the server as JSON with UI resource
 */
export async function handleFridgeWidget() {
  // Get fridge data from server storage (mock for now)
  const fridgeData = mockFridgeData;

  // Create UI resource using @mcp-ui/server
  const uiResource = createUIResource({
    uri: 'ui://fridge-widget',
    content: {
      type: 'rawHtml',
      htmlString: getWidgetHTML(),
    },
    encoding: 'text',
  });

  return {
    structuredContent: fridgeData,
    content: [
      {
        type: 'text',
        text: JSON.stringify(fridgeData, null, 2),
      },
      uiResource,
    ],
  };
}

/**
 * Resource handler for the fridge widget
 * Returns the widget HTML as a resource (for direct resource requests)
 */
export async function handleFridgeWidgetResource(): Promise<{
  contents: Array<UIResource['resource']>;
}> {
  // Create UI resource using @mcp-ui/server
  const uiResource = createUIResource({
    uri: 'ui://fridge-widget',
    content: {
      type: 'rawHtml',
      htmlString: getWidgetHTML(),
    },
    encoding: 'text',
    adapters: {
      appsSdk: {
        enabled: true
      }
    }
  });

  // Extract the resource object from the UIResource
  return {
    contents: [
      uiResource.resource,
    ],
  };
}

/**
 * Tool handler for adding an item to the fridge
 */
export async function handleAddItem(params: {
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: QuantityUnit;
  zoneId?: string;
  expirationDate?: string;
  notes?: string;
  barcode?: string;
}) {
  // Generate unique ID
  const itemId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Create new item
  const newItem: FridgeItem = {
    id: itemId,
    name: params.name,
    category: params.category,
    quantity: {
      value: params.quantity,
      unit: params.unit,
    },
    addedDate: new Date().toISOString(),
    status: calculateItemStatus(params.expirationDate),
    expirationDate: params.expirationDate,
    notes: params.notes,
    barcode: params.barcode,
  };

  // Determine which zone to add the item to
  let targetZoneId = params.zoneId;
  if (!targetZoneId) {
    // Default zone based on category
    const categoryZoneMap: Record<string, string> = {
      'vegetables': 'zone-veggie-drawer',
      'fruits': 'zone-veggie-drawer',
      'frozen': 'zone-freezer',
      'condiments': 'zone-door',
    };
    targetZoneId = categoryZoneMap[params.category] || 'zone-top-shelf';
  }

  // Find the zone and add the item
  const zone = mockFridgeData.fridge.zones.find(z => z.id === targetZoneId);
  if (zone) {
    zone.items.push(newItem);
  } else {
    // If zone not found, add to first zone
    mockFridgeData.fridge.zones[0].items.push(newItem);
  }

  // Update lastUpdated timestamp
  mockFridgeData.fridge.lastUpdated = new Date().toISOString();

  return {
    structuredContent: {
      success: true,
      item: newItem,
      fridge: mockFridgeData.fridge,
    },
    content: [
      {
        type: 'text',
        text: `Successfully added "${params.name}" to the fridge. The item has been placed in ${zone?.name || 'the top shelf'} with status: ${newItem.status}.`,
      },
    ],
  };
}
