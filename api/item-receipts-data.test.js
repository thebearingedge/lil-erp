import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected, uuid } from './__test__'
import { ItemReceipt } from './__fixtures__'
import itemReceiptsData from './item-receipts-data'

describe('itemReceiptsData', () => {

  let trx
  let receipts

  beforeEach(begin(_trx => {
    trx = _trx
    receipts = itemReceiptsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {

    const vendor = {
      party_id: uuid(),
      party_type: 'vendor',
      name: 'Widget Co.'
    }

    const item = {
      item_id: uuid(),
      item_type: 'inventory_item',
      sku: 'widget'
    }

    let receipt
    let payablesCode
    let inventoryCode
    let receivablesCode

    beforeEach(async () => {
      await trx.insert(vendor).into('parties')
      await trx.insert(item).into('items')
      await trx.insert(item).into('inventory_items')
      const {
        accounts_payable_code,
        accounts_receivable_code,
        inventory_assets_code
      } = await trx
        .select('*')
        .from('default_accounts')
        .first()
      receipt = {
        date: new Date(),
        partyId: vendor.party_id,
        lineItems: [{
          itemId: item.item_id,
          itemType: item.item_type,
          sku: item.sku,
          quantity: 1,
          lineTotal: 100
        }]
      }
      payablesCode = accounts_payable_code
      receivablesCode = accounts_receivable_code
      inventoryCode = inventory_assets_code
    })

    it('inserts an "trades" row', async () => {
      await receipts.create(receipt)
      const receiptRow = await trx
        .select('*')
        .from('trades')
        .first()
      expect(receiptRow).to.be.an('object', '"trades" row not found')
    })

    it('inserts a "trade_line_items" row for each line item', async () => {
      await receipts.create(receipt)
      const lineItemRows = await trx
        .select('*')
        .from('trade_line_items')
      expect(lineItemRows).to.have.lengthOf(1)
    })

    it('inserts a "stock_status" row for each inventory line item', async () => {
      await receipts.create(receipt)
      const status = await trx
        .select('*')
        .from('stock_status')
      expect(status).to.have.lengthOf(1)
    })

    it('calculates the average cost of inventory on hand', async () => {
      const { sku } = receipt.lineItems[0]
      await receipts.create({
        ...receipt,
        lineItems: [
          { ...receipt.lineItems[0], quantity:2, lineTotal: 100 }
        ]
      })
      const status = await trx
        .select('*')
        .from('stock_status')
        .where({ sku })
        .first()
      expect(status).to.include({ average_cost: '50.00000' })
    })

    it('recalculates the quantity and average cost of inventory on hand', async () => {
      const { sku } = receipt.lineItems[0]
      const first = {
        ...receipt,
        lineItems: [
          { ...receipt.lineItems[0], quantity: 1, lineTotal: 10 }
        ]
      }
      const second = {
        ...receipt,
        lineItems: [
          { ...receipt.lineItems[0], quantity: 1, lineTotal: 8 }
        ]
      }
      await receipts.create(first)
      const status1 = await trx
        .select('*')
        .from('stock_status')
        .where({ sku })
        .orderBy('inserted_at', 'desc')
        .first()
      expect(status1).to.include({
        quantity: '1',
        average_cost: '10.00000'
      })
      await receipts.create(second)
      const status2 = await trx
        .select('*')
        .from('stock_status')
        .where({ sku })
        .orderBy('inserted_at', 'desc')
        .first()
      expect(status2).to.include({
        quantity: '2',
        average_cost: '9.00000'
      })
    })

    it('retraces the stock status of back-dated purchases', async () => {
      const { sku } = receipt.lineItems[0]
      const today = new Date('1/2/2017')
      const yesterday = new Date('1/1/2017')
      const first = {
        ...receipt,
        date: today,
        lineItems: [
          { ...receipt.lineItems[0], quantity: 1, lineTotal: 10 }
        ]
      }
      const second = {
        ...receipt,
        date: yesterday,
        lineItems: [
          { ...receipt.lineItems[0], quantity: 1, lineTotal: 8 }
        ]
      }
      await receipts.create(first)
      const status1 = await trx
        .select('*')
        .from('stock_status')
        .where({ sku })
        .orderBy('transaction_date', 'desc')
        .orderBy('inserted_at', 'desc')
        .first()
      expect(status1).to.include({
        quantity: '1',
        average_cost: '10.00000'
      })
      await receipts.create(second)
      const status2 = await trx
        .select('*')
        .from('stock_status')
        .where({ sku })
        .orderBy('transaction_date', 'desc')
        .orderBy('inserted_at', 'desc')
        .first()
      expect(status2).to.include({
        quantity: '2',
        average_cost: '9.00000'
      })
    })

    it('inserts a "journal_entries" row for the purchase', async () => {
      await receipts.create(receipt)
      const journalEntryRow = await trx
        .select('*')
        .from('journal_entries')
        .first()
      expect(journalEntryRow).to.be.an('object', 'journal entry not found')
    })

    it('creates "ledger_entries" rows for the purchase', async () => {
      await receipts.create({
        ...receipt,
        lineItems: [
          ...receipt.lineItems,
          { ...receipt.lineItems[0] }
        ]
      })
      const ledgerEntryRows = await trx
        .select('*')
        .from('ledger_entries')
      expect(ledgerEntryRows).to.have.lengthOf(2)
    })

    it('creates a "ledger_entries" row for the correct amount', async () => {
      await receipts.create({
        ...receipt,
        lineItems: [
          { ...receipt.lineItems[0], lineTotal: 1000 }
        ]
      })
      const ledgerEntryRow = await trx
        .select('*')
        .from('ledger_entries')
        .first()
      expect(ledgerEntryRow).to.include({ amount: '1000.00000' })
    })

    it('creates a "ledger_entries" row for the correct accounts', async () => {
      await receipts.create({
        ...receipt,
        lineItems: [
          { ...receipt.lineItems[0], lineTotal: 1000 }
        ]
      })
      const ledgerEntryRow = await trx
        .select('*')
        .from('ledger_entries')
        .first()
      expect(ledgerEntryRow).to.include({
        debit_account_code: inventoryCode,
        credit_account_code: payablesCode
      })
    })

    it('returns the created purchase', async () => {
      const created = await receipts.create(receipt)
      expect(created).to.be.an('object', 'purchase not returned')
    })

    it('returns the created purchase with the correct structure', async () => {
      const created = await receipts.create(receipt)
      expect(created).to.have.structure(ItemReceipt)
    })

    it('creates the purchase with the default payables code', async () => {
      const created = await receipts.create(receipt)
      expect(created).to.have.property('tradeAccountCode', payablesCode)
    })

    it('creates the purchase with a custom payables code', async () => {
      const customPayablesCode = '0000'
      const customPayables = {
        code: customPayablesCode,
        name: 'Other Accounts Payable',
        parent_code: payablesCode
      }
      const customReceipt = {
        ...receipt,
        tradeAccountCode: customPayablesCode
      }
      await trx.insert(customPayables).into('accounts')
      const created = await receipts.create(customReceipt)
      expect(created).to.have.property('tradeAccountCode', customPayablesCode)
    })

    it('does not create purchases against non-payables', async () => {
      const badReceipt = {
        ...receipt,
        tradeAccountCode: receivablesCode
      }
      const err = await rejected(receipts.create(badReceipt))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('trades_trade_account_code_fkey')
    })

    it('does not create a purchase for an unknown vendor', async () => {
      const err = await rejected(receipts.create({
        ...receipt,
        partyId: uuid()
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('trades_party_id_fkey')
    })

    it('does not create a purchase for unknown items', async () => {
      const err = await rejected(receipts.create({
        ...receipt,
        lineItems: [{
          ...receipt.lineItems[0],
          sku: 'otherwidget'
        }]
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('trade_line_items_item_type_fkey')
    })

    it('does not create a purchase for non-"vendor" parties', async () => {
      const customer = { party_id: uuid(), party_type: 'customer', name: 'Widget Fan' }
      await trx.insert(customer).into('parties')
      const err = await rejected(receipts.create({
        ...receipt,
        partyId: customer.party_id
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('trades_party_id_fkey')
    })

  })

})
