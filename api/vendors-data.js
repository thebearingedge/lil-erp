import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function vendorsData(knex) {

  return camelSql({ create })

  async function create({ id, ...vendor }) {
    const stream_id = id || uuid()
    const event_type ='create_vendor'
    const payload = JSON.stringify(vendor)
    return knex.transaction(async trx => {
      await trx
        .insert({ stream_id, event_type, payload })
        .into('event_store')
      return findById(stream_id, trx)
    })
  }

  async function findById(party_id, trx) {
    const vendor = [
      'party_id',
      'name',
      'notes',
      'website',
      'account_number',
      'is_active'
    ]
    return trx
      .select(...vendor)
      .from('vendors')
      .joinRaw('join parties using (party_id, party_type)')
      .where({ party_id })
      .first()
  }

}
