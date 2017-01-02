import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import paymentsData from './payments-data'

describe('paymentsData', () => {

  let trx
  let payments

  beforeEach(begin(_trx => {
    trx = _trx
    payments = paymentsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {
    it('creates a payment', async () => {
      const { id: partyId } = await trx
        .select('id')
        .from('parties')
        .first()
      const { id: paymentMethodId } = await trx
        .select('id')
        .from('payment_methods')
        .first()
      const payment = {
        partyId,
        paymentMethodId,
        date: new Date(),
        paymentAccountCode: '1100',
        tradeAccountCode: '2400',
        amount: 100
      }
      const created = await payments.create(payment)
      expect(created).to.have.structure(structs.Payment)
    })
  })

})
