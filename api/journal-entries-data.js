import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function journalEntriesData(knex) {

  return camelSql({ create })

  async function create({ transaction_id, ...entry }) {
    const stream_id = transaction_id || uuid()
    const event_type ='create_journal_entry'
    const payload = JSON.stringify(entry)
    return knex.transaction(async trx => {
      await trx
        .insert({ stream_id, event_type, payload })
        .into('event_store')
      return findById(stream_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
    const journal_entry = ['transaction_id', 'date', 'memo']
    const ledger_entries = knex.raw(`json_agg(
      json_build_object(
        'entry_id', l.entry_id,
        'debit_account_code', l.debit_account_code,
        'credit_account_code', l.credit_account_code,
        'amount', l.amount
      )
    ) as ledger_entries`)
    return trx
      .select(...journal_entry, ledger_entries)
      .from('journal_entries')
      .joinRaw('join ledger_entries as l using (transaction_id, transaction_type)')
      .groupBy(...journal_entry)
      .where({ transaction_id })
      .first()
  }

}
