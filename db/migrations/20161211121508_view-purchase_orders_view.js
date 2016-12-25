export const up = knex => {
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
  const view = knex
    .select(columns)
    .from('orders as o')
    .join('order_line_items as l', 'o.id', 'l.order_id')
  return knex.raw(`create view "purchase_orders_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "purchase_orders_view"')
