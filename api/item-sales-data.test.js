import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected, uuid } from './__test__'
import { ItemSale } from './__fixtures__'
import itemSalesData from './item-sales-data'

describe('itemSalesData', () => {

  let trx
  let sales

  beforeEach(begin(_trx => {
    trx = _trx
    sales = itemSalesData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {

    const customer = {
      party_id: uuid(),
      party_type: 'customer',
      name: 'Widget Co.'
    }

    const item = {
      item_id: uuid(),
      item_type: 'inventory_item',
      sku: 'widget'
    }

    let sale
    let receivablesCode
    let payablesCode

    beforeEach(async () => {
      await trx.insert(customer).into('parties')
      await trx.insert(item).into('items')
      const { accounts_receivable_code } = await trx
        .select('accounts_receivable_code')
        .from('default_accounts')
        .first()
      const { accounts_payable_code } = await trx
        .select('accounts_payable_code')
        .from('default_accounts')
        .first()
      sale = {
        date: new Date(),
        partyId: customer.party_id,
        lineItems: [{
          itemId: item.item_id,
          itemType: item.item_type,
          sku: item.sku,
          quantity: 1,
          lineTotal: 100
        }]
      }
      receivablesCode = accounts_receivable_code
      payablesCode = accounts_payable_code
    })

    it('inserts an "item_sales" row', async () => {
      await sales.create(sale)
      const saleRow = await trx
        .select('*')
        .from('item_sales')
        .first()
      expect(saleRow).to.be.an('object', '"item_sales" row not found')
    })

    it('inserts an "item_sale_line_items" row for each line item', async () => {
      await sales.create(sale)
      const lineItemRows = await trx
        .select('*')
        .from('item_sale_line_items')
      expect(lineItemRows).to.have.lengthOf(1)
    })

    it('returns the created item sale', async () => {
      const created = await sales.create(sale)
      expect(created).to.be.an('object', 'item sale not returned')
    })

    it('returns the created item sale with the correct structure', async () => {
      const created = await sales.create(sale)
      expect(created).to.have.structure(ItemSale)
    })

    it('creates the item sale with the default receivables code', async () => {
      const created = await sales.create(sale)
      expect(created).to.have.property('tradeAccountCode', receivablesCode)
    })

    it('creates the item sale with a custom receivables code', async () => {
      const customReceivablesCode = '0000'
      const customReceivables = {
        code: customReceivablesCode,
        name: 'Other Accounts Receivable',
        parent_code: receivablesCode
      }
      const customSale = {
        ...sale,
        tradeAccountCode: customReceivablesCode
      }
      await trx.insert(customReceivables).into('accounts')
      const created = await sales.create(customSale)
      expect(created).to.have.property('tradeAccountCode', customReceivablesCode)
    })

    it('does not create item sales against non-receivables', async () => {
      const badSale = {
        ...sale,
        tradeAccountCode: payablesCode
      }
      const err = await rejected(sales.create(badSale))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('item_sales_trade_account_code_fkey')
    })

    it('does not create an item sale for an unknown customer', async () => {
      const err = await rejected(sales.create({
        ...sale,
        partyId: uuid()
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('item_sales_party_id_fkey')
    })

    it('does not create an item sale for unknown items', async () => {
      const err = await rejected(sales.create({
        ...sale,
        lineItems: [{
          ...sale.lineItems[0],
          sku: 'otherwidget'
        }]
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('item_sale_line_items_item_type_fkey')
    })

    it('does not create an item sale for non-"customer" parties', async () => {
      const vendor = { party_id: uuid(), party_type: 'vendor', name: 'Widget Fan' }
      await trx.insert(vendor).into('parties')
      const err = await rejected(sales.create({
        ...sale,
        partyId: vendor.party_id
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('item_sales_party_id_fkey')
    })

  })

})
