export const up = knex => {
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
  const view = knex
    .select(columns)
    .from('shipment_line_items')
  return knex.raw(`create view "shipment_line_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "shipment_line_items_view"')
