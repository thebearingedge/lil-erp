import uuid from 'uuid/v4'
import accounts from './accounts'
import default_accounts from './default-accounts'
import payment_methods from './payment-methods'

export default async function systemSeed(knex) {

  const general_journal = {
    party_id: uuid(),
    party_type: 'general_journal',
    name: uuid()
  }

  await knex
    .insert(general_journal)
    .into('parties')

  await knex
    .insert(accounts)
    .into('accounts')

  await knex
    .insert(default_accounts)
    .into('default_accounts')

  await knex
    .insert(payment_methods)
    .into('payment_methods')
}
