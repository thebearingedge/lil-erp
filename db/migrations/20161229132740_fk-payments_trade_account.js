export const up = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.string('trade_account_code')
        .notNullable()
      tb.enum('trade_account_type', ['accounts_payable', 'accounts_receivable'])
        .notNullable()
      tb.foreign(['trade_account_code', 'trade_account_type'])
        .references(['code', 'type'])
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.dropForeign(['trade_account_code', 'trade_account_type'])
      tb.dropColumn('trade_account_type')
      tb.dropColumn('trade_account_code')
    })
