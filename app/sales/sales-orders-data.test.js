import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import salesOrdersData from './sales-orders-data'

describe('salesOrdersData', () => {

  let trx
  let salesOrders

  beforeEach(begin(_trx => {
    trx = _trx
    salesOrders = salesOrdersData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {

    let partyId
    let sku

    beforeEach(async () => {
      const { id } = await trx
        .select('id')
        .from('customers')
        .first()
      const { _sku } = await trx
        .select('sku as _sku')
        .from('items')
        .first()
      partyId = id
      sku = _sku
    })

    it('creates a sales order', async () => {
      const salesOrder = {
        date: new Date().toJSON(),
        partyId,
        lineItems: [{ sku, quantity: 2, lineTotal: 400 }]
      }
      const created = await salesOrders.create(salesOrder)
      expect(created).to.have.structure(structs.SalesOrder)
    })
  })

  describe('findById', () => {

    let orderId

    beforeEach(async () => {
      const { id } = await trx
        .select('id')
        .from('orders')
        .where('order_type', 'sales_order')
        .first()
      orderId = id
    })

    it('finds a sales order by id', async () => {
      const order = await salesOrders.findById(orderId)
      expect(order).to.have.structure(structs.SalesOrder)
    })
  })

})
