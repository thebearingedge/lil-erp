export const up = async knex => {
  const columns = [
    'p.id',
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'c.email'
  ]
  const view = knex
    .select(columns)
    .from('contacts as c')
    .join('parties as p', 'c.id', 'p.id')
  await knex.raw(`create view "contacts_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "contacts_view"')
