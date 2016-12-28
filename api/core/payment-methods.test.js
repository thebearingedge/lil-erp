import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import paymentMethodsData from './payment-methods-data'

describe('paymentMethodsData', () => {

  let trx
  let paymentMethods

  beforeEach(begin(_trx => {
    trx = _trx
    paymentMethods = paymentMethodsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {
    it('creates a payment method', async () => {
      const paymentMethod = { name: 'Western Union' }
      const created = await paymentMethods.create(paymentMethod)
      expect(created).to.have.structure(structs.PaymentMethod)
      expect(created).to.include({
        isActive: true
      })
    })
  })

})
