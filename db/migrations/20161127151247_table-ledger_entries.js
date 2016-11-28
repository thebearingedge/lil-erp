export const up = ({ schema }) =>
  schema
    .createTable('ledger_entries', tb => {
      tb.string('debit_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
      tb.string('credit_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
      tb.integer('amount')
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('ledger_entries')
