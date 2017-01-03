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

export const Customer = {
  id: String,
  name: String,
  notes: Nullable(String),
  isActive: Boolean
}
