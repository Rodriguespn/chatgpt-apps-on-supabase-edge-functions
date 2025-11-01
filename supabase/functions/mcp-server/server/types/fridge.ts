/**
 * Fridge Data Types
 *
 * These types define the structure for fridge inventory data.
 * They are designed to be compatible with JSON Schema for MCP tool definitions.
 */

/**
 * Zone types representing different compartments in the fridge
 */
export type ZoneType = 'shelf' | 'drawer' | 'door' | 'freezer';

/**
 * Item status based on expiration date
 * - fresh: More than 3 days until expiration (or no expiration date)
 * - expiring-soon: 1-3 days until expiration
 * - expired: Past expiration date
 */
export type ItemStatus = 'fresh' | 'expiring-soon' | 'expired';

/**
 * Food categories for organizing items
 */
export type ItemCategory =
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'vegetables'
  | 'fruits'
  | 'beverages'
  | 'condiments'
  | 'leftovers'
  | 'eggs'
  | 'bakery'
  | 'frozen'
  | 'other';

/**
 * Common units for item quantities
 */
export type QuantityUnit =
  | 'count'
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'oz'
  | 'lb'
  | 'package'
  | 'container';

/**
 * Quantity with value and unit
 */
export interface Quantity {
  /** Numeric value of the quantity (must be positive) */
  value: number;
  /** Unit of measurement */
  unit: QuantityUnit;
}

/**
 * Individual item in the fridge
 */
export interface FridgeItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Category classification */
  category: ItemCategory;
  /** Quantity information */
  quantity: Quantity;
  /** ISO 8601 datetime when the item expires (optional) */
  expirationDate?: string;
  /** ISO 8601 datetime when the item was added */
  addedDate: string;
  /** Current status of the item */
  status: ItemStatus;
  /** Image URL or base64 encoded image (optional) */
  image?: string;
  /** Product barcode (optional) */
  barcode?: string;
  /** Additional notes about the item (optional) */
  notes?: string;
}

/**
 * Zone (compartment/shelf) within the fridge
 */
export interface FridgeZone {
  /** Unique identifier for the zone */
  id: string;
  /** Display name of the zone */
  name: string;
  /** Type of compartment */
  type: ZoneType;
  /** Temperature in Celsius (optional) */
  temperature?: number;
  /** Items stored in this zone */
  items: FridgeItem[];
}

/**
 * Complete fridge data structure
 */
export interface Fridge {
  /** Unique identifier for the fridge */
  id: string;
  /** Display name of the fridge */
  name: string;
  /** ISO 8601 datetime of last update */
  lastUpdated: string;
  /** Zones/compartments in the fridge */
  zones: FridgeZone[];
}

/**
 * Root data structure for fridge information
 */
export interface FridgeData {
  fridge: Fridge;
}

/**
 * Helper type for creating new items (without auto-generated fields)
 */
export type NewFridgeItem = Omit<FridgeItem, 'id' | 'addedDate' | 'status'> & {
  id?: string;
  addedDate?: string;
  status?: ItemStatus;
};

/**
 * Helper type for updating existing items (all fields optional except id)
 */
export type UpdateFridgeItem = Partial<FridgeItem> & {
  id: string;
};

/**
 * JSON Schema definitions for MCP tool parameters
 * These can be used directly in MCP tool definitions
 */
export const FridgeDataJsonSchema = {
  type: 'object',
  properties: {
    fridge: {
      type: 'object',
      required: ['id', 'name', 'lastUpdated', 'zones'],
      properties: {
        id: { type: 'string', description: 'Unique identifier for the fridge' },
        name: { type: 'string', description: 'Display name of the fridge' },
        lastUpdated: { type: 'string', format: 'date-time', description: 'ISO 8601 datetime of last update' },
        zones: {
          type: 'array',
          description: 'Zones/compartments in the fridge',
          items: {
            type: 'object',
            required: ['id', 'name', 'type', 'items'],
            properties: {
              id: { type: 'string', description: 'Unique identifier for the zone' },
              name: { type: 'string', description: 'Display name of the zone' },
              type: {
                type: 'string',
                enum: ['shelf', 'drawer', 'door', 'freezer'],
                description: 'Type of compartment'
              },
              temperature: { type: 'number', description: 'Temperature in Celsius (optional)' },
              items: {
                type: 'array',
                description: 'Items stored in this zone',
                items: {
                  type: 'object',
                  required: ['id', 'name', 'category', 'quantity', 'addedDate', 'status'],
                  properties: {
                    id: { type: 'string', description: 'Unique identifier for the item' },
                    name: { type: 'string', description: 'Display name of the item' },
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
                        'other'
                      ],
                      description: 'Category classification'
                    },
                    quantity: {
                      type: 'object',
                      required: ['value', 'unit'],
                      description: 'Quantity information',
                      properties: {
                        value: { type: 'number', minimum: 0, description: 'Numeric value (must be positive)' },
                        unit: {
                          type: 'string',
                          enum: ['count', 'g', 'kg', 'ml', 'l', 'oz', 'lb', 'package', 'container'],
                          description: 'Unit of measurement'
                        }
                      }
                    },
                    expirationDate: { type: 'string', format: 'date-time', description: 'ISO 8601 datetime when the item expires' },
                    addedDate: { type: 'string', format: 'date-time', description: 'ISO 8601 datetime when the item was added' },
                    status: {
                      type: 'string',
                      enum: ['fresh', 'expiring-soon', 'expired'],
                      description: 'Current status of the item'
                    },
                    image: { type: 'string', description: 'Image URL or base64 encoded image' },
                    barcode: { type: 'string', description: 'Product barcode' },
                    notes: { type: 'string', description: 'Additional notes about the item' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  required: ['fridge']
} as const;
