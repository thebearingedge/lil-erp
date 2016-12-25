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
    const goodsReceivedNote = await goodsReceivedNotesView(trx)
      .where('s.id', id)
      .first()
    const lineItems = await trx
      .select('*')
      .from('shipment_line_items_view')
      .where('shipment_id', id)
    return { lineItems, ...goodsReceivedNote }
  }
}

function goodsReceivedNotesView(knex) {
  const total = knex
    .sum('l.line_total')
    .from('shipment_line_items as l')
    .whereRaw('l.shipment_id = s.id')
    .as('total')
  const columns = [
    's.id',
    's.date',
    's.party_id',
    's.memo',
    's.created_at',
    's.updated_at',
    total
  ]
  return knex
    .select(columns)
    .from('shipments as s')
    .join('shipment_line_items as l', 's.id', 'l.shipment_id')
}
