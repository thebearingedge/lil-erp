import { camelSql, getParty } from '../util'

export default function customersData(knex) {

  return camelSql({ create, findById })

  async function create(doc) {
    return knex.transaction(async trx => {
      const party = getParty(doc, 'customer')
      const [ id ] = await trx
        .insert(party)
        .into('parties')
        .returning('id')
      const customer = { id }
      await trx
        .insert(customer)
        .into('customers')
      return findById(id, trx)
    })
  }

  function findById(id, trx = knex) {
    return customersView(trx)
      .where('c.id', id)
      .first()
  }

}

function customersView(knex) {
  const open_balance = knex
    .select(knex.raw(`
      coalesce(sum(
        case
          when le.debit_code = '1200'
            then le.amount
          else
            -1 * le.amount
        end
      ), 0)::float as open_balance
    `))
    .from('customers as c')
    .join('transactions as t', 'c.id', 't.party_id')
    .join('ledger_entries as le', 't.id', 'le.transaction_id')
    .where('le.debit_code', '=', '1200')
    .orWhere('le.credit_code', '=', '1200')
    .as('open_balance')
  const columns = [
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'c.id',
    open_balance
  ]
  return knex
    .select(columns)
    .from('customers as c')
    .join('parties as p', 'c.id', 'p.id')
}
