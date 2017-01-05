import uuid from 'uuid/V4'
import { camelSql } from './util'

export default function paymentsData(knex) {

  return camelSql({ create })

  async function create({ id, ...payment }) {
    const entity_id = id || uuid()
    const type = 'create_payment'
    const payload = JSON.stringify(payment)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
    const join = [
      'transaction_id',
      'transaction_type',
      'party_id',
      'party_type'
    ]
    const columns = [
      'transaction_id',
      'party_id',
      'payment_method_id',
      'date',
      'memo',
      'trade_account_code',
      'payment_account_code',
      knex.raw('amount::float')
    ]
    return trx
      .select(columns)
      .from('payments as p')
      .joinRaw(`join transactions as t using (${join})`)
      .where({ transaction_id })
      .first()
  }

}
