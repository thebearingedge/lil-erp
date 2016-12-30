import { camelSql, getOrder, getOrderLineItems } from '../util'

export default function salesOrdersData(knex) {

  return camelSql({ create, findById })

  async function create(doc) {
    return knex.transaction(async trx => {
      const order = getOrder(doc, 'sales_order')
      const [ order_id ] = await trx
        .insert(order)
        .into('orders')
        .returning('id')
      const line_items = getOrderLineItems(doc, order_id, 'sales_order')
      await trx
        .insert(line_items)
        .into('order_line_items')
      return findById(order_id, trx)
    })
  }

  async function findById(id, trx = knex) {
    const salesOrder = await salesOrdersView(trx)
      .where('o.id', id)
      .first()
    const lineItems = await orderLineItemsView(trx)
      .where('order_id', id)
    return { lineItems, ...salesOrder }
  }

}

function salesOrdersView(knex) {
  const sales_order = [
    'o.id',
    'o.date',
    'o.party_id as customer_id',
    'o.memo',
    'o.is_closed',
    'o.created_at',
    'o.updated_at'
  ]
  const total = knex.raw(`(${
    knex
      .sum('l.line_total')
      .from('order_line_items as l')
      .whereRaw('l.order_id = o.id')
  })::float as total`)
  const open_balance = knex
    .select(knex.raw(`
      sum(
        (l.line_total / l.quantity)
        *
        (l.quantity - coalesce(s.quantity, 0))
      )::float
    `))
    .from('order_line_items as l')
    .leftJoin('shipment_line_items as s', 'l.id', 's.order_line_item_id')
    .whereRaw('l.order_id = o.id and l.is_closed = false')
    .as('open_balance')
  return knex
    .select([...sales_order, total, open_balance])
    .from('orders as o')
    .join('order_line_items as l', 'o.id', 'l.order_id')
}

function orderLineItemsView(knex) {
  const line_item = [
    'o.id',
    'o.order_id',
    'o.sku',
    'o.quantity',
    'o.description',
    'o.line_total',
    'o.is_closed'
  ]
  const unit_price = knex.raw(`
    (o.line_total / o.quantity)::float as unit_price
  `)
  const quantity_received = knex
    .select(knex.raw('o.quantity - coalesce(sum(s.quantity), 0)::integer'))
    .from('shipment_line_items as s')
    .whereRaw('o.id = s.order_line_item_id')
    .as('quantity_remaining')
  return knex
    .select([...line_item, unit_price, quantity_received])
    .from('order_line_items as o')
    .leftJoin('shipment_line_items as s', 'o.id', 's.order_line_item_id')
}
