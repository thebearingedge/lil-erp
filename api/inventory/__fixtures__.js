import { Nullable } from 'chai-struct'

const Brand = {
  id: String,
  name: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
}

const InventoryItem = {
  sku: String,
  brandName: Nullable(String),
  description: Nullable(String),
  quantityOnPurchaseOrder: Number,
  quantityOnSalesOrder: Number,
  quantityOnHand: Number,
  revenueAccountCode: String,
  costAccountCode: String,
  assetAccountCode: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

export const structs = {
  Brand,
  InventoryItem
}
