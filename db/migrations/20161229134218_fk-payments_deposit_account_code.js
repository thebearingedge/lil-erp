export const up = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.string('deposit_account_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
    })

export const down = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.dropColumn('deposit_account_code')
    })
