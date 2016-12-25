import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import grnData from './grn-data'

describe('grnData', () => {

  let trx
  let grns

  beforeEach(begin(_trx => {
    trx = _trx
    grns = grnData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {

    let partyId
    let sku
    let orderLineItemId

    beforeEach(async () => {
      const { party_id } = await trx
        .select('id as party_id')
        .from('parties')
        .first()
      const { _sku } = await trx
        .select('sku as _sku')
        .from('items')
        .first()
      const { order_line_item_id } = await trx
        .select('id as order_line_item_id')
        .from('order_line_items')
        .first()
      partyId = party_id
      sku = _sku
      orderLineItemId = order_line_item_id
    })

    it('creates a goods received note', async () => {
      const goodsReceivedNote = {
        date: new Date().toJSON(),
        partyId,
        lineItems: [{ sku, orderLineItemId, quantity: 2, lineTotal: 400 }]
      }
      const created = await grns.create(goodsReceivedNote)
      expect(created).to.have.structure(structs.GoodsReceivedNote)
    })

  })

})
