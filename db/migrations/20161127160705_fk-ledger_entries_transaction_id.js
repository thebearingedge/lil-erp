export const up = ({ schema }) =>
  schema
    .table('ledger_entries', tb => {
      tb.uuid('transaction_id')
        .index()
        .notNullable()
        .references('id')
        .inTable('transactions')
    })

export const down = ({ schema }) =>
  schema
    .table('ledger_entries', tb => {
      tb.dropColumn('transaction_id')
    })
