import { Nullable } from 'chai-struct'

const Vendor = {
  id: String,
  name: String,
  notes: Nullable(String),
  website: Nullable(String),
  accountNumber: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  contacts: [{
    id: String,
    name: String,
    email: Nullable(String),
    notes: Nullable(String),
    createdAt: Date,
    updatedAt: Date,
    isActive: Boolean
  }]
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
  lineItems: [{
    id: String,
    orderId: String,
    sku: String,
    quantity: Number,
    description: Nullable(String),
    unitPrice: Number,
    lineTotal: String,
    isClosed: Boolean
  }]
}

export const structs = {
  Vendor,
  PurchaseOrder
}
