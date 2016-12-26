import { Nullable } from 'chai-struct'

const Customer = {
  id: String,
  name: String,
  notes: Nullable(String),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}

export const structs = {
  Customer
}
