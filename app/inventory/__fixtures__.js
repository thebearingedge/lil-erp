import { Nullable } from 'chai-struct'

const InventoryItem = {
  sku: String,
  description: Nullable(String),
  assetCode: String,
  revenueCode: String,
  costCode: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

export const structs = {
  InventoryItem
}
