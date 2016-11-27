import { Nullable } from 'chai-struct'

const Contact = {
  id: Number,
  name: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

const Vendor = {
  id: Number,
  partyId: Number,
  accountNumber: Nullable(String),
  notes: String,
  name: String,
  createdAt: Date,
  updatedAt: Date,
  contacts: [Contact]
}

export const structs = {
  Vendor
}
