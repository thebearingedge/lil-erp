import { Nullable } from 'chai-struct'

const Customer = {
  id: String,
  name: String,
  notes: Nullable(String),
  openBalance: Number,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}

const SalesOrder = {
  id: String,
  date: Date,
  customerId: String,
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

export const structs = {
  Customer,
  SalesOrder
}
