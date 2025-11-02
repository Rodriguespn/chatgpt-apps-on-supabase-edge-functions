# Fridge Data Format

This document describes the JSON format used to represent fridge contents in the widget application.

## Overview

The fridge data structure is designed to represent a comprehensive inventory of items stored in a refrigerator, including their locations, quantities, expiration dates, and other relevant metadata.

## Root Structure

```json
{
  "fridge": {
    "id": "string",
    "name": "string",
    "lastUpdated": "ISO 8601 datetime string",
    "zones": []
  }
}
```

## Zones

A fridge is divided into zones (compartments/shelves). Each zone contains items.

```json
{
  "id": "string",
  "name": "string",
  "type": "shelf" | "drawer" | "door" | "freezer",
  "temperature": "number (optional)",
  "items": []
}
```

### Zone Types

- **shelf**: Regular shelves in the main compartment
- **drawer**: Vegetable/fruit drawers or storage drawers
- **door**: Door storage compartments
- **freezer**: Freezer compartment

## Items

Items represent individual food products or containers stored in the fridge.

```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "quantity": {
    "value": "number",
    "unit": "string"
  },
  "expirationDate": "ISO 8601 datetime string (optional)",
  "addedDate": "ISO 8601 datetime string",
  "status": "fresh" | "expiring-soon" | "expired",
  "image": "string (URL or base64, optional)",
  "barcode": "string (optional)",
  "notes": "string (optional)"
}
```

### Categories

Suggested categories (extensible):

- `dairy` - Milk, cheese, yogurt, butter
- `meat` - Fresh meat, poultry
- `seafood` - Fish, shellfish
- `vegetables` - Fresh vegetables
- `fruits` - Fresh fruits
- `beverages` - Drinks, juices
- `condiments` - Sauces, dressings
- `leftovers` - Prepared meals
- `eggs` - Eggs and egg products
- `bakery` - Bread, pastries
- `frozen` - Frozen items
- `other` - Miscellaneous items

### Quantity Units

Common units (extensible):

- `count` - Individual items (e.g., "3 eggs")
- `g` - Grams
- `kg` - Kilograms
- `ml` - Milliliters
- `l` - Liters
- `oz` - Ounces
- `lb` - Pounds
- `package` - Packaged items
- `container` - Containers

### Item Status

Status is automatically calculated based on `expirationDate`:

- **fresh**: More than 3 days until expiration (or no expiration date)
- **expiring-soon**: 1-3 days until expiration
- **expired**: Past expiration date

## Complete Example

```json
{
  "fridge": {
    "id": "fridge-001",
    "name": "Kitchen Fridge",
    "lastUpdated": "2025-10-13T10:30:00Z",
    "zones": [
      {
        "id": "zone-top-shelf",
        "name": "Top Shelf",
        "type": "shelf",
        "temperature": 4,
        "items": [
          {
            "id": "item-001",
            "name": "Whole Milk",
            "category": "dairy",
            "quantity": {
              "value": 1,
              "unit": "l"
            },
            "expirationDate": "2025-10-20T00:00:00Z",
            "addedDate": "2025-10-10T08:00:00Z",
            "status": "fresh",
            "barcode": "012345678901"
          },
          {
            "id": "item-002",
            "name": "Cheddar Cheese",
            "category": "dairy",
            "quantity": {
              "value": 200,
              "unit": "g"
            },
            "expirationDate": "2025-10-15T00:00:00Z",
            "addedDate": "2025-10-08T12:00:00Z",
            "status": "expiring-soon"
          }
        ]
      },
      {
        "id": "zone-veggie-drawer",
        "name": "Vegetable Drawer",
        "type": "drawer",
        "items": [
          {
            "id": "item-003",
            "name": "Carrots",
            "category": "vegetables",
            "quantity": {
              "value": 6,
              "unit": "count"
            },
            "addedDate": "2025-10-11T00:00:00Z",
            "status": "fresh",
            "notes": "Organic"
          },
          {
            "id": "item-004",
            "name": "Lettuce",
            "category": "vegetables",
            "quantity": {
              "value": 1,
              "unit": "count"
            },
            "expirationDate": "2025-10-14T00:00:00Z",
            "addedDate": "2025-10-12T00:00:00Z",
            "status": "expiring-soon"
          }
        ]
      },
      {
        "id": "zone-door-top",
        "name": "Door Top Shelf",
        "type": "door",
        "items": [
          {
            "id": "item-005",
            "name": "Ketchup",
            "category": "condiments",
            "quantity": {
              "value": 1,
              "unit": "container"
            },
            "expirationDate": "2026-01-15T00:00:00Z",
            "addedDate": "2025-09-01T00:00:00Z",
            "status": "fresh"
          }
        ]
      }
    ]
  }
}
```

## Validation Rules

1. **Required Fields**:
   - `fridge.id`, `fridge.name`, `fridge.zones`
   - `zone.id`, `zone.name`, `zone.type`, `zone.items`
   - `item.id`, `item.name`, `item.category`, `item.quantity`, `item.addedDate`, `item.status`

2. **Date Format**: All dates must be ISO 8601 format (e.g., `2025-10-13T10:30:00Z`)

3. **Unique IDs**: All `id` fields within their scope must be unique

4. **Quantity**: `quantity.value` must be a positive number

## Future Extensions

Possible future enhancements to consider:

- User-defined custom categories
- Shopping list integration (reorder items)
- Nutritional information
- Storage recommendations
- Temperature alerts
- Item sharing/collaboration features
