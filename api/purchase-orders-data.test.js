import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected, uuid } from './__test__'
import { PurchaseOrder } from './__fixtures__'
import purchaseOrdersData from './purchase-orders-data'

describe('purchaseOrdersData', () => {

  let trx
  let orders

  beforeEach(begin(_trx => {
    trx = _trx
    orders = purchaseOrdersData(trx)
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

    let order

    beforeEach(async () => {
      await trx.insert(vendor).into('parties')
      await trx.insert(item).into('items')
      order = {
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
    })

    it('inserts a "purchase_orders" row', async () => {
      await orders.create(order)
      const orderRow = await trx
        .select('*')
        .from('purchase_orders')
        .first()
      expect(orderRow).to.be.an('object', '"purchase_orders" row not found')
    })

    it('inserts a "purchase_order_line_items" row for each line item', async () => {
      await orders.create(order)
      const lineItemRows = await trx
        .select('*')
        .from('purchase_order_line_items')
      expect(lineItemRows).to.have.lengthOf(1)
    })

    it('returns the created purchase order', async () => {
      const created = await orders.create(order)
      expect(created).to.be.an('object', 'purchase order not returned')
    })

    it('returns the created purchase order with the correct structure', async () => {
      const created = await orders.create(order)
      expect(created).to.have.structure(PurchaseOrder)
    })

    it('does not create a purchase order for an unknown party', async () => {
      const err = await rejected(orders.create({
        ...order,
        partyId: uuid()
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('purchase_orders_party_id_fkey')
    })

    it('does not create a purchase order for unknown items', async () => {
      const err = await rejected(orders.create({
        ...order,
        lineItems: [{
          ...order.lineItems[0],
          sku: 'otherwidget'
        }]
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('purchase_order_line_items_item_type_fkey')
    })

    it('does not create a purchase order for non-"vendor" parties', async () => {
      const customer = { party_id: uuid(), party_type: 'customer', name: 'Widget Fan' }
      await trx.insert(customer).into('parties')
      const err = await rejected(orders.create({
        ...order,
        partyId: customer.party_id
      }))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('purchase_orders_party_id_fkey')
    })

  })

})
