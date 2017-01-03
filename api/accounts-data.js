import uuid from 'uuid/V4'
import { camelSql } from './util'

export default function accountsData(knex) {

  return camelSql({ create })

  async function create({ id, ...account }) {
    const entity_id = id || uuid()
    const type = 'create_account'
    const payload = JSON.stringify(account)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('events')
      return findById(entity_id, trx)
    })
  }

  async function findById(id, trx) {
    return trx
      .select('*')
      .from('accounts')
      .where({ id })
      .first()
  }

}
