import uuid from 'uuid/V4'
import { camelSql } from './util'

export default function journalEntriesData(knex) {

  return camelSql({ create })

  async function create({ transaction_id, ...entry }) {
    const entity_id = transaction_id || uuid()
    const type = 'create_journal_entry'
    const payload = JSON.stringify(entry)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
    const journal_entry = ['id', 'date', 'memo']
    const ledger_entries = knex.raw(`json_agg(
      json_build_object(
        'id', l.id,
        'debit_account_code', l.debit_account_code,
        'credit_account_code', l.credit_account_code,
        'amount', l.amount
      )
    ) as ledger_entries`)
    return trx
      .select(...journal_entry, ledger_entries)
      .from('journal_entries as j')
      .joinRaw('join ledger_entries as l using (transaction_id, transaction_type)')
      .groupBy(...journal_entry)
      .where({ transaction_id })
      .first()
  }

}
