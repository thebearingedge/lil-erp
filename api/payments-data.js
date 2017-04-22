import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function paymentsData(knex) {

  return camelSql({ create })

  async function create({ id, ...payment }) {
    const stream_id = id || uuid()
    const event_type ='create_payment'
    const payload = JSON.stringify(payment)
    return knex.transaction(async trx => {
      await trx
        .insert({ stream_id, event_type, payload })
        .into('event_store')
      return findById(stream_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
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
      .select(...columns)
      .from('payments')
      .where({ transaction_id })
      .first()
  }

}
