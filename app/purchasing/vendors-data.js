import { pick } from 'lodash'
import { camelSql, getParty } from '../util'

function getVendor(obj) {
  return pick(obj, ['account_number', 'website'])
}

export default function vendorsData(knex) {

  return camelSql({ findById, create })

  async function create(data) {
    return knex.transaction(async trx => {
      const party = getParty(data, 'vendor')
      const vendor = getVendor(data)
      const [ id ] = await trx
        .insert(party)
        .into('parties')
        .returning('id')
      await trx
        .insert({ ...vendor, id })
        .into('vendors')
        .returning('id')
      return findById(id, trx)
    })
  }

  async function findById(id, trx = knex) {
    const vendor = await trx
      .select('*')
      .from('vendors_view')
      .where({ id })
      .first()
    const contacts = await trx
      .select('cv.*')
      .from('parties as p')
      .join('parties_contacts as pc', 'p.id', 'pc.party_id')
      .join('contacts_view as cv', 'pc.contact_id', 'cv.id')
      .where('p.id', id)
    return { ...vendor, contacts }
  }
}
