export const up = async knex => {
  const columns = [
    'i.sku',
    'i.description',
    'i.is_active',
    'i.created_at',
    'i.updated_at',
    'si.revenue_code'
  ]
  const view = knex
    .select(columns)
    .from('service_items as si')
    .join('items as i', 'si.sku', 'i.sku')
  await knex.raw(`create view "service_items_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "service_items_view"')
