import { camelSql, getShipment, getShipmentLineItems } from '../util'

export default function grnData(knex) {

  return camelSql({ create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const shipment = getShipment(doc, 'goods_received_note')
      const [ shipment_id ] = await trx
        .insert(shipment)
        .into('shipments')
        .returning('id')
      const line_items = getShipmentLineItems(doc, shipment_id, 'goods_received_note')
      await trx
        .insert(line_items)
        .into('shipment_line_items')
      return findById(shipment_id, trx)
    })
  }

  async function findById(id, trx) {
    const goodsReceivedNote = await trx
      .select('*')
      .from('goods_received_notes_view')
      .where({ id })
      .first()
    const lineItems = await trx
      .select('*')
      .from('shipment_line_items_view')
      .where('shipment_id', id)
    return { lineItems, ...goodsReceivedNote }
  }
}
