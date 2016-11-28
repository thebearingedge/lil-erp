export const up = knex => {
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
  const view = knex
    .select([ ...transaction, ledger_entries ])
    .from('transactions as t')
    .join('ledger_entries as le', 't.id', 'le.transaction_id')
    .groupBy(...transaction)
  return knex.raw(`create view "journal_entries_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "journal_entries_view"')
