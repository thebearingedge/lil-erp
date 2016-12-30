import { camelSql, getTransaction } from '../util'

export default function journalEntriesData(knex) {

  return camelSql({ create })

  async function create({ ledger_entries, ...data }) {
    return knex.transaction(async trx => {
      const transaction = getTransaction(data, 'journal_entry')
      const [ transaction_id ] = await trx
        .insert(transaction)
        .into('transactions')
        .returning('id')
      await trx
        .insert(ledger_entries.map(entry => ({ ...entry, transaction_id })))
        .into('ledger_entries')
      return findById(transaction_id, trx)
    })
  }

  async function findById(id, trx) {
    return journalEntriesView(trx)
      .where({ id })
      .first()
  }
}

function journalEntriesView(knex) {
  const transaction = [
    't.id',
    't.date',
    't.memo',
    't.created_at',
    't.updated_at'
  ]
  const ledger_entries = knex.raw(`
    coalesce(
      json_agg(
        json_build_object(
          'debit_code', le.debit_code,
          'credit_code', le.credit_code,
          'amount', le.amount
        )
      ) filter (where le is not null),
      '[]'::json
    ) as ledger_entries
  `)
  return knex
    .select([ ...transaction, ledger_entries ])
    .from('transactions as t')
    .join('ledger_entries as le', 't.id', 'le.transaction_id')
    .groupBy(...transaction)
}
