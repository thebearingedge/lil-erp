import { Nullable } from 'chai-struct'

export const Account = {
  id: String,
  code: String,
  name: String,
  description: Nullable(String),
  parentCode: Nullable(String),
  type: Nullable(String),
  class: Nullable(String),
  isActive: Boolean,
  isSystemAccount: Boolean
}

export const JournalEntry = {
  id: String,
  date: Date,
  memo: Nullable(String),
  ledgerEntries: [{
    id: String,
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
