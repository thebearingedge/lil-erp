import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql('get_default_accounts.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function get_default_inventory_revenue()')
  await raw('drop function get_default_inventory_cost()')
  await raw('drop function get_default_inventory_assets()')
  await raw('drop function get_default_trade_payable()')
  await raw('drop function get_default_trade_receivable()')
}
