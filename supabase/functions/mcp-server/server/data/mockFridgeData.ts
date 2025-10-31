import type { FridgeData } from '../types/fridge.ts';

/**
 * Mock fridge data stored on the server
 */
export const mockFridgeData: FridgeData = {
  fridge: {
    id: 'fridge-001',
    name: 'Kitchen Fridge',
    lastUpdated: new Date().toISOString(),
    zones: [
      {
        id: 'zone-top-shelf',
        name: 'Top Shelf',
        type: 'shelf',
        temperature: 4,
        items: [
          {
            id: 'item-001',
            name: 'Whole Milk',
            category: 'dairy',
            quantity: { value: 1, unit: 'l' },
            expirationDate: '2025-10-20T00:00:00Z',
            addedDate: '2025-10-10T08:00:00Z',
            status: 'fresh',
            barcode: '012345678901',
          },
          {
            id: 'item-002',
            name: 'Cheddar Cheese',
            category: 'dairy',
            quantity: { value: 200, unit: 'g' },
            expirationDate: '2025-10-15T00:00:00Z',
            addedDate: '2025-10-08T12:00:00Z',
            status: 'expiring-soon',
            notes: 'Sharp cheddar',
          },
        ],
      },
      {
        id: 'zone-veggie-drawer',
        name: 'Vegetable Drawer',
        type: 'drawer',
        items: [
          {
            id: 'item-003',
            name: 'Carrots',
            category: 'vegetables',
            quantity: { value: 6, unit: 'count' },
            addedDate: '2025-10-11T00:00:00Z',
            status: 'fresh',
            notes: 'Organic',
          },
          {
            id: 'item-004',
            name: 'Lettuce',
            category: 'vegetables',
            quantity: { value: 1, unit: 'count' },
            expirationDate: '2025-10-14T00:00:00Z',
            addedDate: '2025-10-12T00:00:00Z',
            status: 'expiring-soon',
          },
        ],
      },
      {
        id: 'zone-door',
        name: 'Door Shelf',
        type: 'door',
        items: [
          {
            id: 'item-005',
            name: 'Ketchup',
            category: 'condiments',
            quantity: { value: 1, unit: 'container' },
            expirationDate: '2026-01-15T00:00:00Z',
            addedDate: '2025-09-01T00:00:00Z',
            status: 'fresh',
          },
        ],
      },
    ],
  },
};
