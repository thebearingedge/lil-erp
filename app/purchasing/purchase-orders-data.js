import { camelSql, getOrder, getOrderLineItems } from '../util'

export default function purchaseOrdersData(knex) {

  return camelSql({ create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const order = getOrder(doc, 'purchase_order')
      const [ order_id ] = await trx
        .insert(order)
        .into('orders')
        .returning('id')
      const line_items = getOrderLineItems(doc, order_id, 'purchase_order')
      await trx
        .insert(line_items)
        .into('order_line_items')
      return findById(order_id, trx)
    })
  }

  async function findById(id, trx) {
    const purchaseOrder = await purchaseOrdersView(trx)
      .where('o.id', id)
      .first()
    const lineItems = await trx
      .select('*')
      .from('order_line_items_view')
      .where('order_id', id)
    return { lineItems, ...purchaseOrder }
  }
}


function purchaseOrdersView(knex) {
  const open_balance = knex
    .select(knex.raw(`sum(
      l.line_total / l.quantity *
      (l.quantity - coalesce(s.quantity, 0)::integer)
    )`))
    .from('order_line_items as l')
    .leftJoin('shipment_line_items as s', 'l.id', 's.order_line_item_id')
    .whereRaw('l.order_id = o.id and l.is_closed = false')
    .as('open_balance')
  const total = knex
    .sum('l.line_total')
    .from('order_line_items as l')
    .whereRaw('l.order_id = o.id')
    .as('total')
  const columns = [
    'o.id',
    'o.date',
    'o.party_id as vendor_id',
    'o.memo',
    'o.is_closed',
    'o.created_at',
    'o.updated_at',
    total,
    open_balance
  ]
  return knex
    .select(columns)
    .from('orders as o')
    .join('order_line_items as l', 'o.id', 'l.order_id')
}
