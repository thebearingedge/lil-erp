import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function accountsData(knex) {

  return camelSql({ create })

  async function create({ id, ...account }) {
    const stream_id = id || uuid()
    const event_type ='create_account'
    const payload = JSON.stringify(account)
    return knex.transaction(async trx => {
      await trx
        .insert({ stream_id, event_type, payload })
        .into('event_store')
      return findById(stream_id, trx)
    })
  }

  async function findById(account_id, trx) {
    return trx
      .select('*')
      .from('accounts')
      .where({ account_id })
      .first()
  }

}
