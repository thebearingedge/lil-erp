import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql(__dirname, 'get_default_accounts.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function get_default_inventory_revenue()')
  await raw('drop function get_default_inventory_cost()')
  await raw('drop function get_default_inventory_assets()')
}
