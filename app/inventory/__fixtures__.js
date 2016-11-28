import { Nullable } from 'chai-struct'

const ServiceItem = {
  sku: String,
  description: Nullable(String),
  revenueCode: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

export const structs = {
  ServiceItem
}
