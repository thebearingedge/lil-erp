export const up = async knex => {
  const columns = [
    'i.sku',
    'i.description',
    'i.is_active',
    'i.created_at',
    'i.updated_at',
    'ii.revenue_code',
    'ii.cost_code',
    'ii.asset_code',
    'b.name as brand_name'
  ]
  const view = knex
    .select(columns)
    .from('inventory_items as ii')
    .join('items as i', 'ii.sku', 'i.sku')
    .leftJoin('brands as b', 'ii.brand_id', 'b.id')
  return knex.raw(`create view "inventory_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "inventory_items_view"')
