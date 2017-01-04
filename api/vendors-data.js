import uuid from 'uuid/V4'
import { camelSql } from './util'

export default function vendorsData(knex) {

  return camelSql({ create })

  async function create({ id, ...vendor }) {
    const entity_id = id || uuid()
    const type = 'create_vendor'
    const payload = JSON.stringify(vendor)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(party_id, trx) {
    return trx
      .select('party_id', 'name', 'notes', 'website', 'account_number', 'is_active')
      .from('vendors')
      .joinRaw('join parties using (party_id, party_type)')
      .where({ party_id })
      .first()
  }

}
