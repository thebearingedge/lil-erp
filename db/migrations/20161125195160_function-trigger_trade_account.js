import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql('trigger_trade_account.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function trigger_trade_account(table_name regclass)')
}
