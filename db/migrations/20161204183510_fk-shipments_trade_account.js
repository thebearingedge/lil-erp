export const up = async ({ schema, raw }) => {
  await schema
    .table('shipments', tb => {
      tb.string('trade_account_code')
        .notNullable()
      tb.enum('trade_account_type', ['accounts_payable', 'accounts_receivable'])
        .notNullable()
      tb.foreign(['trade_account_code', 'trade_account_type'])
        .references(['code', 'type'])
        .inTable('accounts')
        .onUpdate('cascade')
    })
  await raw('select trigger_trade_account(?)', ['shipments'])
}

export const down = async ({ schema, raw }) => {
  await raw('drop trigger set_trade_account on "shipments"')
  await schema
    .table('shipments', tb => {
      tb.dropForeign(['trade_account_code', 'trade_account_type'])
      tb.dropColumn('trade_account_type')
      tb.dropColumn('trade_account_code')
    })
}
