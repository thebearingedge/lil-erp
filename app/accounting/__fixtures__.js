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

const Entry = {
  id: String,
  debitAccountCode: String,
  creditAccountCode: String,
  date: Date,
  amount: Number,
  createdAt: Date,
  updatedAt: Date
}

export const structs = {
  Account,
  Entry
}
