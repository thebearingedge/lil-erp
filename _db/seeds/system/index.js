import accounts from './accounts'
import default_accounts from './default-accounts'

export default async function systemSeed(knex) {

  await knex
    .insert(accounts)
    .into('accounts')

  await knex
    .insert(default_accounts)
    .into('default_accounts')
}
