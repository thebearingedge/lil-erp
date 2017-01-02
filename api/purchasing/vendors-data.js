import { pick } from 'lodash'
import { camelSql, getParty } from '../util'

const vendorProps = [
  'account_number',
  'website'
]

function getVendor(doc, id) {
  return {
    ...pick(doc, vendorProps),
    id
  }
}

export default function vendorsData(knex) {

  return camelSql({ findById, create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const party = getParty(doc, 'vendor')
      const [ id ] = await trx
        .insert(party)
        .into('parties')
        .returning('id')
      const vendor = getVendor(doc, id)
      await trx
        .insert(vendor)
        .into('vendors')
        .returning('id')
      return findById(id, trx)
    })
  }

  async function findById(id, trx = knex) {
    return vendorsView(trx)
      .where('v.id', id)
      .first()
  }

}

function vendorsView(knex) {
  const vendor = [
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'v.id',
    'v.account_number',
    'v.website'
  ]
  const open_balance = knex
    .with('accounts_payable', qb =>
      qb.select('code')
        .from('accounts')
        .where('type', 'accounts_payable')
    )
    .select(knex.raw(`
      coalesce(sum(case
                     when le.credit_code in (
                            select code
                            from accounts_payable
                          )
                     then le.amount
                     else -1 * le.amount
                   end), 0)::float
    `))
    .from('transactions as t')
    .join('ledger_entries as le', 't.id', 'le.transaction_id')
    .whereRaw('v.id = t.party_id')
    .andWhere(qb =>
      qb.whereIn('le.debit_code', knex
          .select('code')
          .from('accounts_payable')
        )
        .orWhereIn('le.credit_code', knex
          .select('code')
          .from('accounts_payable')
        )
    )
    .as('open_balance')
  return knex
    .select([...vendor, open_balance])
    .from('vendors as v')
    .join('parties as p', 'v.id', 'p.id')
}
