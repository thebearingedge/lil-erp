import uuid from 'uuid/V4'
import accounts from './accounts'
import default_accounts from './default-accounts'

export default async function systemSeed(knex) {

  const system = { party_id: uuid(), party_type: 'system', name: uuid() }

  await knex
    .insert(system)
    .into('parties')

  await knex
    .insert(accounts)
    .into('accounts')

  await knex
    .insert(default_accounts)
    .into('default_accounts')
}
