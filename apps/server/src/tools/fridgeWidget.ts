/**
 * Fridge Widget Tool
 *
 * This tool returns a UIResource containing the embedded React widget
 * that displays fridge contents stored on the server.
 */

import { createUIResource, getAppsSdkAdapterScript } from '@mcp-ui/server';
import type { FridgeData, FridgeItem, ItemStatus, ItemCategory, QuantityUnit } from '../types/fridge.js';
import { mockFridgeData } from '../data/mockFridgeData.js';

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
 * Widget assets (JS/CSS) are served as external resources from /static/widget/assets/
 */
export function getWidgetHTML(): string {
  // Get the built-in adapter script from @mcp-ui/server
  const adapterScript = getAppsSdkAdapterScript();

  // Build a custom HTML that dynamically loads external assets
  const widgetHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fridge Widget</title>
    <script>
      ${adapterScript}
    </script>
    <script>
      // Dynamically load CSS and JS based on base URL
      (function() {
        var baseUrl = window.innerBaseUrl || 'https://fridge.mcp.intelunix.fr';

        // Load CSS
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.crossOrigin = 'anonymous';
        link.href = baseUrl + '/static/widget/assets/style.css';
        document.head.appendChild(link);

        // Load widget script
        var widgetScript = document.createElement('script');
        widgetScript.type = 'module';
        widgetScript.crossOrigin = 'anonymous';
        widgetScript.src = baseUrl + '/static/widget/assets/index.js';
        document.head.appendChild(widgetScript);
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  console.error('[getWidgetHTML] Generated HTML with external assets and built-in adapter');

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
export async function handleFridgeWidgetResource() {
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
