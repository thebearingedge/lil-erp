import { Nullable } from 'chai-struct'

const Account = {
  id: String,
  code: String,
  name: String,
  description: Nullable(String),
  parentCode: Nullable(String),
  type: Nullable(String),
  class: Nullable(String),
  balance: Number,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  isSystemAccount: Boolean
}

const LedgerEntry = {
  debitAccountCode: String,
  creditAccountCode: String,
  amount: Number
}

const JournalEntry = {
  id: String,
  date: Date,
  memo: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  ledgerEntries: [LedgerEntry]
}

export const structs = {
  Account,
  JournalEntry
}
