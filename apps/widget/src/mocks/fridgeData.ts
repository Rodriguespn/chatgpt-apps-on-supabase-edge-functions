import type { FridgeData } from '../types/fridge';

/**
 * Mock fridge data for testing and development
 */
export const mockFridgeData: FridgeData = {
  fridge: {
    id: 'fridge-001',
    name: 'Kitchen Fridge',
    lastUpdated: '2025-10-13T10:30:00Z',
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
            quantity: {
              value: 1,
              unit: 'l'
            },
            expirationDate: '2025-10-20T00:00:00Z',
            addedDate: '2025-10-10T08:00:00Z',
            status: 'fresh',
            barcode: '012345678901'
          },
          {
            id: 'item-002',
            name: 'Cheddar Cheese',
            category: 'dairy',
            quantity: {
              value: 200,
              unit: 'g'
            },
            expirationDate: '2025-10-15T00:00:00Z',
            addedDate: '2025-10-08T12:00:00Z',
            status: 'expiring-soon',
            notes: 'Sharp cheddar'
          },
          {
            id: 'item-003',
            name: 'Greek Yogurt',
            category: 'dairy',
            quantity: {
              value: 500,
              unit: 'g'
            },
            expirationDate: '2025-10-18T00:00:00Z',
            addedDate: '2025-10-09T00:00:00Z',
            status: 'fresh'
          }
        ]
      },
      {
        id: 'zone-middle-shelf',
        name: 'Middle Shelf',
        type: 'shelf',
        temperature: 4,
        items: [
          {
            id: 'item-004',
            name: 'Chicken Breast',
            category: 'meat',
            quantity: {
              value: 500,
              unit: 'g'
            },
            expirationDate: '2025-10-14T00:00:00Z',
            addedDate: '2025-10-12T00:00:00Z',
            status: 'expiring-soon',
            notes: 'Organic, free-range'
          },
          {
            id: 'item-005',
            name: 'Leftover Pasta',
            category: 'leftovers',
            quantity: {
              value: 1,
              unit: 'container'
            },
            expirationDate: '2025-10-14T00:00:00Z',
            addedDate: '2025-10-11T19:30:00Z',
            status: 'expiring-soon',
            notes: 'Spaghetti carbonara from dinner'
          },
          {
            id: 'item-006',
            name: 'Salmon Fillets',
            category: 'seafood',
            quantity: {
              value: 2,
              unit: 'count'
            },
            expirationDate: '2025-10-13T00:00:00Z',
            addedDate: '2025-10-11T00:00:00Z',
            status: 'expired'
          }
        ]
      },
      {
        id: 'zone-bottom-shelf',
        name: 'Bottom Shelf',
        type: 'shelf',
        temperature: 3,
        items: [
          {
            id: 'item-007',
            name: 'Orange Juice',
            category: 'beverages',
            quantity: {
              value: 1,
              unit: 'l'
            },
            expirationDate: '2025-10-25T00:00:00Z',
            addedDate: '2025-10-10T00:00:00Z',
            status: 'fresh',
            notes: 'Freshly squeezed'
          },
          {
            id: 'item-008',
            name: 'Beer Pack',
            category: 'beverages',
            quantity: {
              value: 6,
              unit: 'count'
            },
            addedDate: '2025-10-05T00:00:00Z',
            status: 'fresh',
            notes: 'IPA craft beer'
          }
        ]
      },
      {
        id: 'zone-veggie-drawer',
        name: 'Vegetable Drawer',
        type: 'drawer',
        temperature: 5,
        items: [
          {
            id: 'item-009',
            name: 'Carrots',
            category: 'vegetables',
            quantity: {
              value: 6,
              unit: 'count'
            },
            addedDate: '2025-10-11T00:00:00Z',
            status: 'fresh',
            notes: 'Organic'
          },
          {
            id: 'item-010',
            name: 'Lettuce',
            category: 'vegetables',
            quantity: {
              value: 1,
              unit: 'count'
            },
            expirationDate: '2025-10-14T00:00:00Z',
            addedDate: '2025-10-12T00:00:00Z',
            status: 'expiring-soon',
            notes: 'Romaine lettuce'
          },
          {
            id: 'item-011',
            name: 'Tomatoes',
            category: 'vegetables',
            quantity: {
              value: 5,
              unit: 'count'
            },
            expirationDate: '2025-10-16T00:00:00Z',
            addedDate: '2025-10-10T00:00:00Z',
            status: 'fresh'
          },
          {
            id: 'item-012',
            name: 'Bell Peppers',
            category: 'vegetables',
            quantity: {
              value: 3,
              unit: 'count'
            },
            expirationDate: '2025-10-17T00:00:00Z',
            addedDate: '2025-10-11T00:00:00Z',
            status: 'fresh',
            notes: 'Red and yellow'
          }
        ]
      },
      {
        id: 'zone-fruit-drawer',
        name: 'Fruit Drawer',
        type: 'drawer',
        items: [
          {
            id: 'item-013',
            name: 'Apples',
            category: 'fruits',
            quantity: {
              value: 4,
              unit: 'count'
            },
            addedDate: '2025-10-09T00:00:00Z',
            status: 'fresh',
            notes: 'Gala apples'
          },
          {
            id: 'item-014',
            name: 'Strawberries',
            category: 'fruits',
            quantity: {
              value: 1,
              unit: 'package'
            },
            expirationDate: '2025-10-15T00:00:00Z',
            addedDate: '2025-10-12T00:00:00Z',
            status: 'expiring-soon'
          },
          {
            id: 'item-015',
            name: 'Grapes',
            category: 'fruits',
            quantity: {
              value: 500,
              unit: 'g'
            },
            expirationDate: '2025-10-19T00:00:00Z',
            addedDate: '2025-10-11T00:00:00Z',
            status: 'fresh',
            notes: 'Green grapes'
          }
        ]
      },
      {
        id: 'zone-door-top',
        name: 'Door Top Shelf',
        type: 'door',
        items: [
          {
            id: 'item-016',
            name: 'Ketchup',
            category: 'condiments',
            quantity: {
              value: 1,
              unit: 'container'
            },
            expirationDate: '2026-01-15T00:00:00Z',
            addedDate: '2025-09-01T00:00:00Z',
            status: 'fresh'
          },
          {
            id: 'item-017',
            name: 'Mustard',
            category: 'condiments',
            quantity: {
              value: 1,
              unit: 'container'
            },
            expirationDate: '2025-12-20T00:00:00Z',
            addedDate: '2025-08-15T00:00:00Z',
            status: 'fresh',
            notes: 'Dijon mustard'
          },
          {
            id: 'item-018',
            name: 'Mayonnaise',
            category: 'condiments',
            quantity: {
              value: 1,
              unit: 'container'
            },
            expirationDate: '2025-11-30T00:00:00Z',
            addedDate: '2025-09-10T00:00:00Z',
            status: 'fresh'
          }
        ]
      },
      {
        id: 'zone-door-middle',
        name: 'Door Middle Shelf',
        type: 'door',
        items: [
          {
            id: 'item-019',
            name: 'Butter',
            category: 'dairy',
            quantity: {
              value: 250,
              unit: 'g'
            },
            expirationDate: '2025-10-22T00:00:00Z',
            addedDate: '2025-10-08T00:00:00Z',
            status: 'fresh',
            notes: 'Salted butter'
          },
          {
            id: 'item-020',
            name: 'Eggs',
            category: 'eggs',
            quantity: {
              value: 10,
              unit: 'count'
            },
            expirationDate: '2025-10-25T00:00:00Z',
            addedDate: '2025-10-07T00:00:00Z',
            status: 'fresh',
            notes: 'Free-range'
          }
        ]
      },
      {
        id: 'zone-door-bottom',
        name: 'Door Bottom Shelf',
        type: 'door',
        items: [
          {
            id: 'item-021',
            name: 'Water Bottles',
            category: 'beverages',
            quantity: {
              value: 6,
              unit: 'count'
            },
            addedDate: '2025-10-12T00:00:00Z',
            status: 'fresh',
            notes: 'Sparkling water'
          },
          {
            id: 'item-022',
            name: 'Apple Juice',
            category: 'beverages',
            quantity: {
              value: 1,
              unit: 'l'
            },
            expirationDate: '2025-10-28T00:00:00Z',
            addedDate: '2025-10-11T00:00:00Z',
            status: 'fresh'
          }
        ]
      }
    ]
  }
};
