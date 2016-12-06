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
  quantityOnHand: Number,
  assetCode: String,
  revenueCode: String,
  costCode: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

export const structs = {
  Brand,
  InventoryItem
}
