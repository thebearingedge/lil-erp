import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected, uuid } from './__test__'
import { Payment } from './__fixtures__'
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
      const { accounts_receivable_code } = await trx
        .select('accounts_receivable_code')
        .from('default_accounts')
        .first()
      const { accounts_payable_code } = await trx
        .select('accounts_payable_code')
        .from('default_accounts')
        .first()
      const { method } = await trx
        .select('id as method')
        .from('payment_methods')
        .where('name', 'ilike', 'cash')
        .first()
      cashCode = cash
      paymentMethodId = method
      receivablesCode = accounts_receivable_code
      payablesCode = accounts_payable_code
    })

    describe('for all parties', () => {

      let party
      let payment

      beforeEach(async () => {
        const [ _party ] = await trx
          .insert({ party_id: uuid(), party_type: 'customer', name: 'Bender' })
          .from('parties')
          .returning('*')
        party = _party
        payment = {
          partyId: party.party_id,
          date: new Date(),
          paymentAccountCode: cashCode,
          paymentMethodId,
          amount: 100
        }
      })

      it('inserts "transactions", "payments" "journal_entries", and "ledger_entries" records', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('party_id', party.party_id)
          .first()
          expect(transactionRow).to.exist
        const paymentRow = await trx
          .select('*')
          .from('payments')
          .where('transaction_id', transactionRow.transaction_id)
          .first()
        expect(paymentRow).to.exist
        const journalEntryRow = await trx
          .select('*')
          .from('journal_entries')
          .where('transaction_id', transactionRow.transaction_id)
        expect(journalEntryRow).to.exist
        const ledgerEntryRow = await trx
          .select('*')
          .from('ledger_entries')
          .where('transaction_id', transactionRow.transaction_id)
          .first()
        expect(ledgerEntryRow).to.exist
      })

      it('inserts a "transactions" record of type "payment"', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('transaction_type', 'payment')
          .first()
        expect(transactionRow).to.exist
      })

      it('inserts a "transactions" record of type "journal_entry"', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('transaction_type', 'journal_entry')
          .first()
        expect(transactionRow).to.exist
      })

      it('inserts a "ledger_entries" record with the correct accounts', async () => {
        await payments.create(payment)
        const transactionRow = await trx
          .select('*')
          .from('transactions')
          .where('party_id', party.party_id)
          .first()
        const ledgerEntryRow = await trx
          .select('*')
          .from('ledger_entries')
          .where('transaction_id', transactionRow.transaction_id)
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
        expect(created).to.have.structure(Payment)
      })

    })

    describe('from customer parties', () => {

      let customer
      let payment

      beforeEach(async () => {
        const [ _customer ] = await trx
          .insert({ party_id: uuid(), party_type: 'customer', name: 'Fry' })
          .into('parties')
          .returning('*')
        customer = _customer
        payment = {
          partyId: customer.party_id,
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
          .that.includes('payments_trade_account_code_fkey')
      })

    })

    describe('to vendor parties', () => {

      let vendor
      let payment

      beforeEach(async () => {
        const [ _vendor ] = await trx
          .insert({ party_id: uuid(), party_type: 'vendor', name: 'Planet Express' })
          .into('parties')
          .returning('*')
        vendor = _vendor
        payment = {
          partyId: vendor.party_id,
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
          .that.includes('payments_trade_account_code_fkey')
      })

    })

  })

})
