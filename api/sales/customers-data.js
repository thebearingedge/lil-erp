import { camelSql, getParty } from '../util'

export default function customersData(knex) {

  return camelSql({ create, findById })

  async function create(doc) {
    return knex.transaction(async trx => {
      const party = getParty(doc, 'customer')
      const [ id ] = await trx
        .insert(party)
        .into('parties')
        .returning('id')
      const customer = { id }
      await trx
        .insert(customer)
        .into('customers')
      return findById(id, trx)
    })
  }

  function findById(id, trx = knex) {
    return customersView(trx)
      .where('c.id', id)
      .first()
  }

}

function customersView(knex) {
  const columns = [
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'c.id'
  ]
  return knex
    .select(columns)
    .from('customers as c')
    .join('parties as p', 'c.id', 'p.id')
}
