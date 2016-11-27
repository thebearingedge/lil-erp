export const up = async knex => {
  const columns = [
    'p.id',
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'v.account_number',
    'v.website'
  ]
  const view = knex
    .select(columns)
    .from('vendors as v')
    .join('parties as p', 'v.id', 'p.id')
  await knex.raw(`create view "vendors_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "vendors_view"')
