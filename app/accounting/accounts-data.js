import { camelSql } from '../util'

export default function accountsData(knex) {

  return camelSql({ create, update, find })

  function create(account) {
    return knex.transaction(async trx => {
      const [ code ] = await trx
        .insert(account)
        .into('accounts')
        .returning('code')
      return findByCode(code, trx)
    })
  }

  function update(code, updates) {
    return knex.transaction(async trx => {
      const [ savedCode ] = await trx
        .update(updates)
        .into('accounts')
        .where({ code })
        .returning('code')
      return findByCode(savedCode, trx)
    })
  }

  function findByCode(code, trx) {
    return accountsView(trx)
      .where({ code })
      .first()
  }

  function find() {
    return accountsView(knex)
  }

}

function accountsView(knex) {
  const balance = knex.raw(`
    coalesce(sum(
      case when le.debit_code = a.code
           then le.amount
           else -1 * le.amount
      end
    ), 0::float) as balance
  `)
  return knex
    .select('a.*', balance)
    .from('accounts as a')
    .leftJoin('ledger_entries as le', qb =>
      qb.on('a.code', '=', 'le.debit_code')
        .orOn('a.code', '=', 'le.credit_code')
    )
    .groupBy('a.code')
}
