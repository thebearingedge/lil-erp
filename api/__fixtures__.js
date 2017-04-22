import { Nullable } from 'chai-struct'

export const Account = {
  accountId: String,
  code: String,
  name: String,
  description: Nullable(String),
  parentCode: Nullable(String),
  accountType: Nullable(String),
  class: Nullable(String),
  isActive: Boolean,
  isSystemAccount: Boolean
}

export const JournalEntry = {
  transactionId: String,
  date: Date,
  memo: Nullable(String),
  ledgerEntries: [{
    entryId: String,
    debitAccountCode: String,
    creditAccountCode: String,
    amount: Number
  }]
}

export const Customer = {
  partyId: String,
  name: String,
  notes: Nullable(String),
  isActive: Boolean
}

export const Vendor = {
  partyId: String,
  name: String,
  notes: Nullable(String),
  website: Nullable(String),
  accountNumber: Nullable(String),
  isActive: Boolean
}

export const Payment = {
  transactionId: String,
  partyId: String,
  paymentMethodId: String,
  date: Date,
  amount: Number,
  memo: Nullable(String),
  tradeAccountCode: String,
  paymentAccountCode: String
}

export const Brand = {
  brandId: String,
  brandName: String,
  isActive: Boolean
}

export const InventoryItem = {
  itemId: String,
  sku: String,
  brandName: Nullable(String),
  description: Nullable(String),
  salesAccountCode: String,
  costAccountCode: String,
  assetAccountCode: String,
  isActive: Boolean
}

export const PurchaseOrder = {
  orderId: String,
  partyId: String,
  date: Date,
  lineItems: [{
    lineItemId: String,
    sku: String,
    quantity: Number,
    description: Nullable(String),
    lineTotal: Number
  }]
}

export const SalesOrder = {
  orderId: String,
  partyId: String,
  date: Date,
  lineItems: [{
    lineItemId: String,
    sku: String,
    quantity: Number,
    description: Nullable(String),
    lineTotal: Number
  }]
}

export const ItemReceipt = {
  transactionId: String,
  partyId: String,
  tradeAccountCode: String,
  date: Date,
  lineItems: [{
    lineItemId: String,
    sku: String,
    quantity: Number,
    description: Nullable(String),
    lineTotal: Number
  }]
}

export const ItemSale = {
  transactionId: String,
  partyId: String,
  tradeAccountCode: String,
  date: Date,
  lineItems: [{
    lineItemId: String,
    sku: String,
    quantity: Number,
    description: Nullable(String),
    lineTotal: Number
  }]
}
