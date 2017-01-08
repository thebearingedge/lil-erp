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
    let receivablesCode

    beforeEach(async () => {
      await trx.insert(vendor).into('parties')
      await trx.insert(item).into('items')
      const { accounts_payable_code } = await trx
        .select('accounts_payable_code')
        .from('default_accounts')
        .first()
      const { accounts_receivable_code } = await trx
        .select('accounts_receivable_code')
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
    })

    it('inserts an "trades" row', async () => {
      await receipts.create(receipt)
      const receiptRow = await trx
        .select('*')
        .from('trades')
        .first()
      expect(receiptRow).to.be.an('object', '"trades" row not found')
    })

    it('inserts an "item_receipt_line_items" row for each line item', async () => {
      await receipts.create(receipt)
      const lineItemRows = await trx
        .select('*')
        .from('trade_line_items')
      expect(lineItemRows).to.have.lengthOf(1)
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
