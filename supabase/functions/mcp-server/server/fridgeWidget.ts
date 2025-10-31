/**
 * Fridge Widget Module - Re-exports all handlers
 */

export { getWidgetHTML, handleFridgeWidget, handleFridgeWidgetResource, handleAddItem } from './tools/fridgeWidget.ts';
export type { FridgeData, FridgeItem, ItemStatus, ItemCategory, QuantityUnit } from './types/fridge.ts';
export { mockFridgeData } from './data/mockFridgeData.ts';
