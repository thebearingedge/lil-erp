import { Nullable } from 'chai-struct'

const Account = {
  code: String,
  name: String,
  description: Nullable(String),
  isActive: Boolean,
  parentCode: Nullable(String),
  createdAt: Date,
  updatedAt: Date
}

const LedgerEntry = {
  debitCode: String,
  creditCode: String,
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
