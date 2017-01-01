import { readSql } from './helpers'

export const up = async ({ schema, raw }) => {
  await schema
    .table('payments', tb => {
      tb.string('payment_account_code')
        .notNullable()
      tb.enum('payment_account_type', ['cash', 'credit_cards'])
        .notNullable()
      tb.foreign(['payment_account_code', 'payment_account_type'])
        .references(['code', 'type'])
        .inTable('accounts')
        .onUpdate('cascade')
    })
  await raw(await readSql('set_payment_account_type.sql'))
}

export const down = async ({ schema, raw }) => {
  await raw('drop trigger set_payment_account_type on "payments"')
  await raw('drop function set_payment_account_type()')
  await schema
    .table('payments', tb => {
      tb.dropForeign(['payment_account_code', 'payment_account_type'])
      tb.dropColumn('payment_account_type')
      tb.dropColumn('payment_account_code')
    })
}
