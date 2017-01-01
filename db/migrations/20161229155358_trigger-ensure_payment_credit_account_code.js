import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql('ensure_payment_trade_account.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop trigger ensure_payment_trade_account on "payments"')
  await raw('drop function ensure_payment_trade_account()')
}
