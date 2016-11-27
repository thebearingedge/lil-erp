import { camelSql } from '../util'

export default function vendorsData(knex) {

  return camelSql({ findById, create })

  async function create(vendor) {
    return knex.transaction(async trx => {
      const { name, notes } = vendor
      const [ party_id ] = await trx
        .insert({ name, notes })
        .into('parties')
        .returning('id')
      const [ contact_id ] = await trx
        .insert({ name })
        .into('contacts')
        .returning('id')
      await trx
        .insert({ party_id, contact_id })
        .into('parties_contacts')
      const [ id ] = await trx
        .insert({ party_id })
        .into('vendors')
        .returning('id')
      return findById(id, trx)
    })
  }

  async function findById(id, trx = knex) {
    const vendor = await trx
      .select('v.*', 'p.name', 'p.notes')
      .from('vendors as v')
      .join('parties as p', 'v.party_id', 'p.id')
      .where('v.id', id)
      .first()
    const { party_id } = vendor
    const contacts = await trx
      .select('c.*')
      .from('parties as p')
      .join('parties_contacts as pc', 'p.id', 'pc.party_id')
      .join('contacts as c', 'pc.contact_id', 'c.id')
      .where({ party_id })
    return { ...vendor, contacts }
  }
}
