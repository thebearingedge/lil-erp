const Payment = {
  id: String,
  partyId: String,
  paymentMethodId: String,
  date: Date,
  amount: Number,
  paymentAccountCode: String,
  tradeAccountCode: String
}

const PaymentMethod = {
  id: String,
  name: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}

export const structs = {
  PaymentMethod,
  Payment
}