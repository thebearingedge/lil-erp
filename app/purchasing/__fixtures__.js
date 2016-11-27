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
  name: String,
  createdAt: Date,
  updatedAt: Date,
  contacts: [Contact]
}

export const structs = {
  Vendor
}
