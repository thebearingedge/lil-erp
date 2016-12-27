import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import purchaseOrdersData from './purchase-orders-data'

describe('purchaseOrdersData', () => {

  let trx
  let purchaseOrders

  beforeEach(begin(_trx => {
    trx = _trx
    purchaseOrders = purchaseOrdersData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {

    let partyId
    let sku

    beforeEach(async () => {
      const { party_id } = await trx
        .select('id as party_id')
        .from('parties')
        .first()
      const { _sku } = await trx
        .select('sku as _sku')
        .from('items')
        .first()
      partyId = party_id
      sku = _sku
    })

    it('creates a purchase order', async () => {
      const purchaseOrder = {
        date: new Date().toJSON(),
        partyId,
        lineItems: [{ sku, quantity: 2, lineTotal: 400 }]
      }
      const created = await purchaseOrders.create(purchaseOrder)
      expect(created).to.have.structure(structs.PurchaseOrder)
    })
  })

})
