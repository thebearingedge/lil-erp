export const up = knex => {
  const unit_price = knex.raw('(o.line_total / o.quantity)::float as unit_price')
  const quantity_received = knex
    .select(knex.raw('o.quantity - coalesce(sum(s.quantity), 0)::integer'))
    .from('shipment_line_items as s')
    .whereRaw('o.id = s.order_line_item_id')
    .as('quantity_remaining')
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
    .leftJoin('shipment_line_items as s', 'o.id', 's.order_line_item_id')
  return knex.raw(`create view "order_line_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "order_line_items_view"')
