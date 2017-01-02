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

  async function findById(id, trx = knex) {
    return customersView(trx)
      .where('c.id', id)
      .first()
  }

}

function customersView(knex) {
  const customer = [
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'c.id'
  ]
  const open_balance = knex
    .with('accounts_receivable', qb =>
      qb.select('code')
        .from('accounts')
        .where('type', 'accounts_receivable')
    )
    .select(knex.raw(`
      coalesce(sum(case
                     when le.debit_code in (
                            select code
                            from accounts_receivable
                          )
                     then le.amount
                     else -1 * le.amount
                   end), 0)::float
    `))
    .from('transactions as t')
    .join('ledger_entries as le', 't.id', 'le.transaction_id')
    .whereRaw('c.id = t.party_id')
    .andWhere(qb =>
      qb.whereIn('le.debit_code', knex
          .select('code')
          .from('accounts_receivable')
        )
        .orWhereIn('le.credit_code', knex
          .select('code')
          .from('accounts_receivable')
        )
    )
    .as('open_balance')
  return knex
    .select([...customer, open_balance])
    .from('customers as c')
    .join('parties as p', 'c.id', 'p.id')
}
