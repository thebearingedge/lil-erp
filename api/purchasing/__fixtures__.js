import { Nullable } from 'chai-struct'

const Vendor = {
  id: String,
  name: String,
  notes: Nullable(String),
  website: Nullable(String),
  accountNumber: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}

const PurchaseOrder = {
  id: String,
  date: Date,
  vendorId: String,
  memo: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  isClosed: Boolean,
  total: String,
  openBalance: String,
  lineItems: [{
    id: String,
    orderId: String,
    sku: String,
    quantity: Number,
    description: Nullable(String),
    unitPrice: Number,
    lineTotal: String,
    quantityRemaining: Number,
    isClosed: Boolean
  }]
}

const ItemReceipt = {
  id: String,
  date: Date,
  partyId: String,
  memo: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  total: String,
  lineItems:[{
    id: String,
    shipmentId: String,
    orderLineItemId: Nullable(String),
    sku: String,
    quantity: Number,
    description: Nullable(String),
    unitPrice: Number,
    lineTotal: String
  }]
}

export const structs = {
  Vendor,
  PurchaseOrder,
  ItemReceipt
}
