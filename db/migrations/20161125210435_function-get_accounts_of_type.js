import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql('get_accounts_of_type.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function get_accounts_of_type(account_type varchar)')
}
