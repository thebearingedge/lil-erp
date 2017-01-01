import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql('inherit_parent_account_type.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop trigger inherit_parent_account_type on "accounts"')
  await raw('drop function inherit_parent_account_type()')
  await raw('drop trigger inherit_parent_account_class on "accounts"')
  await raw('drop function inherit_parent_account_class()')
}
