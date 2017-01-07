import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function customersData(knex) {

  return camelSql({ create })

  async function create({ id, ...customer }) {
    const entity_id = id || uuid()
    const type = 'create_customer'
    const payload = JSON.stringify(customer)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(party_id, trx) {
    return trx
      .select('party_id', 'name', 'notes', 'is_active')
      .from('customers')
      .joinRaw('join parties using (party_id, party_type)')
      .where({ party_id })
      .first()
  }

}
