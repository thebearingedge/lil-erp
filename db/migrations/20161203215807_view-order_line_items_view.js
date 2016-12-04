export const up = knex => {
  const columns = [
    'id',
    'order_id',
    'sku',
    'quantity',
    'description',
    'line_total',
    'is_closed',
    knex.raw('(line_total / quantity)::float as unit_price')
  ]
  const view = knex
    .select(columns)
    .from('order_line_items')
  return knex.raw(`create view "order_line_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "order_line_items_view"')
