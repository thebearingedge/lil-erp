export const up = knex => {
  const quantityOnPurchaseOrder = knex
    .select(knex.raw('coalesce(sum(l.quantity), 0)::integer'))
    .from('order_line_items as l')
    .whereRaw('l.sku = ii.sku and l.order_type = \'purchase_order\'')
    .as('quantity_on_purchase_order')
  const columns = [
    'i.sku',
    'i.description',
    'i.is_active',
    'i.created_at',
    'i.updated_at',
    'ii.revenue_code',
    'ii.cost_code',
    'ii.asset_code',
    'b.name as brand_name',
    quantityOnPurchaseOrder
  ]
  const view = knex
    .select(columns)
    .from('inventory_items as ii')
    .join('items as i', 'ii.sku', 'i.sku')
    .leftJoin('brands as b', 'ii.brand_id', 'b.id')
    .leftJoin('order_line_items as l', 'i.sku', 'l.sku')
  return knex.raw(`create view "inventory_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "inventory_items_view"')
