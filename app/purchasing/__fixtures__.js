import { Nullable } from 'chai-struct'

const Contact = {
  id: String,
  name: String,
  email: Nullable(String),
  notes: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}

const Vendor = {
  id: String,
  name: String,
  notes: String,
  website: Nullable(String),
  accountNumber: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  contacts: [Contact]
}

export const structs = {
  Vendor
}
