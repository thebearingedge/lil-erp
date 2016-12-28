import { camelSql, getShipment, getShipmentLineItems } from '../util'

export default function itemReceiptsData(knex) {

  return camelSql({ create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const shipment = getShipment(doc, 'item_receipt')
      const [ shipment_id ] = await trx
        .insert(shipment)
        .into('shipments')
        .returning('id')
      const line_items = getShipmentLineItems(
        doc,
        shipment_id,
        'item_receipt'
      )
      await trx
        .insert(line_items)
        .into('shipment_line_items')
      return findById(shipment_id, trx)
    })
  }

  async function findById(id, trx) {
    const itemReceipt = await itemReceiptsView(trx)
      .where('s.id', id)
      .first()
    const lineItems = await shipmentLineItemsView(trx)
      .where('shipment_id', id)
    return { lineItems, ...itemReceipt }
  }
}

function itemReceiptsView(knex) {
  const total = knex
    .sum('l.line_total')
    .from('shipment_line_items as l')
    .whereRaw('l.shipment_id = s.id')
  const columns = [
    's.id',
    's.date',
    's.party_id',
    's.memo',
    's.created_at',
    's.updated_at',
    knex.raw(`(${total})::float as total`)
  ]
  return knex
    .select(columns)
    .from('shipments as s')
    .join('shipment_line_items as l', 's.id', 'l.shipment_id')
}

function shipmentLineItemsView(knex) {
  const columns = [
    'id',
    'shipment_id',
    'order_line_item_id',
    'sku',
    'quantity',
    'description',
    'line_total',
    knex.raw('(line_total / quantity)::float as unit_price')
  ]
  return knex
    .select(columns)
    .from('shipment_line_items')
}
