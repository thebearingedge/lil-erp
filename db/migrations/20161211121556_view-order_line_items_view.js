export const up = knex => {
  const unit_price = knex.raw('(o.line_total / o.quantity)::float as unit_price')
  const quantity_received = knex
    .select(knex.raw('coalesce(sum(r.quantity), 0)::integer'))
    .from('receipt_line_items as r')
    .whereRaw('o.id = r.order_line_item_id')
    .as('quantity_received')
  const columns = [
    'o.id',
    'o.order_id',
    'o.sku',
    'o.quantity',
    'o.description',
    'o.line_total',
    'o.is_closed',
    unit_price,
    quantity_received
  ]
  const view = knex
    .select(columns)
    .from('order_line_items as o')
    .leftJoin('receipt_line_items as r', 'o.id', 'r.order_line_item_id')
  return knex.raw(`create view "order_line_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "order_line_items_view"')
