/**
 * Fridge Widget Module - Re-exports all handlers
 */

export {
  getWidgetHTML,
  handleAddItem,
  handleFridgeWidget,
  handleFridgeWidgetResource,
} from './tools/fridgeWidget.ts';
export type {
  FridgeData,
  FridgeItem,
  ItemCategory,
  ItemStatus,
  QuantityUnit,
} from './types/fridge.ts';
export { mockFridgeData } from './data/mockFridgeData.ts';
