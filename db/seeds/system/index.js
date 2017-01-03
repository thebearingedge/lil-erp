import accounts from './accounts'

export default async function systemSeed(knex) {

  await knex
    .insert(accounts)
    .into('accounts')
}
