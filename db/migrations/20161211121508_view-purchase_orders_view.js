export const up = knex => {
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
    total
  ]
  const view = knex
    .select(columns)
    .from('orders as o')
    .join('order_line_items as l', 'o.id', 'l.order_id')
  return knex.raw(`create view "purchase_orders_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "purchase_orders_view"')
