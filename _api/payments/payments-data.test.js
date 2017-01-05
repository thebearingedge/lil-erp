import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected } from '../__test__'
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

    let cashCode
    let paymentMethodId
    let receivablesCode
    let payablesCode

    beforeEach(async () => {
      const { cash } = await trx
        .select('code as cash')
        .from('accounts')
        .where('type', 'cash')
        .first()
      const { trade_receivable } = await trx
        .select('trade_receivable')
        .from('default_accounts')
        .first()
      const { trade_payable } = await trx
        .select('trade_payable')
        .from('default_accounts')
        .first()
      const { method } = await trx
        .select('id as method')
        .from('payment_methods')
        .where('name', 'ilike', 'cash')
        .first()
      cashCode = cash
      paymentMethodId = method
      receivablesCode = trade_receivable
      payablesCode = trade_payable
    })

    describe('for all parties', () => {

      let party
      let payment

      beforeEach(async () => {
        const [ _party ] = await trx
          .insert({ name: 'Bender', party_type: 'customer' })
          .into('parties')
          .returning('*')
        party = _party
        payment = {
          partyId: party.id,
          date: new Date(),
          paymentAccountCode: cashCode,
          paymentMethodId,
          amount: 100
        }
      })

      it('inserts "transactions", "payments" and "ledger_entries" rows', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('party_id', party.id)
          .first()
        const paymentRow = await trx
          .select('*')
          .from('payments')
          .where('party_id', party.id)
          .first()
        const ledgerEntryRow = await trx
          .select('*')
          .from('ledger_entries')
          .where('transaction_id', transactionRow.id)
          .first()
        expect(transactionRow).to.exist
        expect(paymentRow).to.exist
        expect(ledgerEntryRow).to.exist
      })

      it('inserts a "transactions" record of type "payment"', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('party_id', party.id)
          .first()
        expect(transactionRow).to.include({ type: 'payment' })
      })

      it('inserts a "ledger_entries" record with the correct accounts', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('party_id', party.id)
          .first()
        const ledgerEntryRow = await trx
          .select('*')
          .from('ledger_entries')
          .where('transaction_id', transactionRow.id)
          .first()
        expect(ledgerEntryRow).to.include({
          debit_account_code: cashCode,
          credit_account_code: receivablesCode
        })
      })

      it('returns the created payment', async () => {
        const created = await payments.create(payment)
        expect(created).to.exist
      })

      it('returns the payment with the correct structure', async () => {
        const created = await payments.create(payment)
        expect(created).to.have.structure(structs.Payment)
      })

    })

    describe('from customer parties', () => {

      let customer
      let payment

      beforeEach(async () => {
        const [ _customer ] = await trx
          .insert({ name: 'Fry', party_type: 'customer' })
          .into('parties')
          .returning('*')
        customer = _customer
        payment = {
          partyId: customer.id,
          date: new Date(),
          paymentAccountCode: cashCode,
          paymentMethodId,
          amount: 100
        }
      })

      it('creates the payment with the default receivables code', async () => {
        const created = await payments.create(payment)
        expect(created).to.have.property('tradeAccountCode', receivablesCode)
      })

      it('creates the payment with a custom receivables code', async () => {
        const customCode = '0000'
        const customReceivables = {
          code: customCode,
          name: 'Other Accounts Payable',
          parent_code: receivablesCode
        }
        const customPayment = {
          ...payment,
          tradeAccountCode: customCode
        }
        await trx.insert(customReceivables).into('accounts')
        const created = await payments.create(customPayment)
        expect(created).to.have.property('tradeAccountCode', customCode)
      })

      it('does not create customer payments against non-receivables', async () => {
        const badPayment = {
          ...payment,
          tradeAccountCode: payablesCode
        }
        const err = await rejected(payments.create(badPayment))
        expect(err)
          .to.be.an('error')
          .with.property('message')
          .that.includes('payments_trade_account_code_trade_account_type_foreign')
      })

    })

    describe('to vendor parties', () => {

      let vendor
      let payment

      beforeEach(async () => {
        const [ _vendor ] = await trx
          .insert({ name: 'Planet Express', party_type: 'vendor' })
          .into('parties')
          .returning('*')
        vendor = _vendor
        payment = {
          partyId: vendor.id,
          date: new Date(),
          paymentAccountCode: cashCode,
          paymentMethodId,
          amount: 100
        }
      })

      it('creates the payment with the default payables code', async () => {
        const created = await payments.create(payment)
        expect(created).to.have.property('tradeAccountCode', payablesCode)
      })

      it('creates the payment with a custom payables code', async () => {
        const customCode = '0000'
        const customPayables = {
          code: customCode,
          name: 'Other Accounts Payable',
          parent_code: payablesCode
        }
        const customPayment = {
          ...payment,
          tradeAccountCode: customCode
        }
        await trx.insert(customPayables).into('accounts')
        const created = await payments.create(customPayment)
        expect(created).to.have.property('tradeAccountCode', customCode)
      })

      it('does not create vendor payments against non-payables', async () => {
        const badPayment = {
          ...payment,
          tradeAccountCode: receivablesCode
        }
        const err = await rejected(payments.create(badPayment))
        expect(err)
          .to.be.an('error')
          .with.property('message')
          .that.includes('payments_trade_account_code_trade_account_type_foreign')
      })

    })

  })

})
