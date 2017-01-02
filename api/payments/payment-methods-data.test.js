import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected } from '../__test__'
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

    const paymentMethod = { name: 'Western Union' }

    it('inserts a "payment_methods" record', async () => {
      await paymentMethods.create(paymentMethod)
      const record = await trx
        .select('*')
        .from('payment_methods')
        .where('name', paymentMethod.name)
        .first()
      expect(record).to.exist
    })

    it('returns the created payment method', async () => {
      const created = await paymentMethods.create(paymentMethod)
      expect(created).to.exist
    })

    it('returns the payment method with the correct structure', async () => {
      const created = await paymentMethods.create(paymentMethod)
      expect(created).to.have.structure(structs.PaymentMethod)
    })

    it('creates the payment method with default properties', async () => {
      const created = await paymentMethods.create(paymentMethod)
      expect(created).to.include({
        isActive: true
      })
    })

    it('does not create payment methods with the same name', async () => {
      await paymentMethods.create(paymentMethod)
      const otherPaymentMethod = { ...paymentMethod }
      const err = await rejected(paymentMethods.create(otherPaymentMethod))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('payment_methods_name_unique')
    })

  })

})
