import { camelSql, getTransaction } from '../util'

export default function journalEntriesData(knex) {

  return camelSql({ create })

  function create({ ledger_entries, ...data }) {
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

  function findById(id, trx) {
    return trx
      .select('*')
      .from('journal_entries_view')
      .where({ id })
      .first()
  }
}
