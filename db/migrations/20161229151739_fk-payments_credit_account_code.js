export const up = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.string('credit_account_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
    })

export const down = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.dropColumn('credit_account_code')
    })
