import { camelSql } from '../util'

export default function accountsData(knex) {

  return camelSql({ create, update, find, makeInactive })

  async function create(account) {
    return knex.transaction(async trx => {
      const [ code ] = await trx
        .insert(account)
        .into('accounts')
        .returning('code')
      return findByCode(code, trx)
    })
  }

  async function update(code, updates) {
    return knex.transaction(async trx => {
      const [ savedCode ] = await trx
        .update(updates)
        .into('accounts')
        .where({ code })
        .returning('code')
      return findByCode(savedCode, trx)
    })
  }

  async function findByCode(code, trx) {
    return accountsView(trx)
      .where({ code })
      .first()
  }

  async function find() {
    return accountsView(knex)
  }

  async function makeInactive(code) {
    return update(code, { is_active: false })
  }

}

function accountsView(knex) {
  const balance = knex.raw(`
    coalesce(sum(
      case
        when le.debit_account_code = a.code
          then le.amount
        else
          -1 * le.amount
      end
    ), 0)::float as balance
  `)
  return knex
    .select('a.*', balance)
    .from('accounts as a')
    .leftJoin('ledger_entries as le', qb =>
      qb.on('a.code', '=', 'le.debit_account_code')
        .orOn('a.code', '=', 'le.credit_account_code')
    )
    .groupBy('a.code')
}