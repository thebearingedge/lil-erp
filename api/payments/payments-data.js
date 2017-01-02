import { camelSql } from '../util'

export default function paymentsData(knex) {

  return camelSql({ create })

  async function create(payment) {
    return knex.transaction(async trx => {
      const [ id ] = await trx
        .insert(payment)
        .into('payments')
        .returning('id')
      return findById(id, trx)
    })
  }

  async function findById(id, trx) {
    const columns = [
      'id',
      'party_id',
      'payment_method_id',
      'date',
      'payment_account_code',
      'trade_account_code',
      knex.raw('amount::float')
    ]
    return trx
      .select(columns)
      .from('payments')
      .where({ id })
      .first()
  }

}
