const Payment = {
  id: String,
  partyId: String,
  paymentMethodId: String,
  date: Date,
  amount: Number,
  assetCode: String,
  creditCode: String
}

const PaymentMethod = {
  id: String,
  name: String,
  isActive: Boolean
}

export const structs = {
  PaymentMethod,
  Payment
}
