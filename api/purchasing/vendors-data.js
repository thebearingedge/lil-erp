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
  const columns = [
    'p.name',
    'p.notes',
    'p.is_active',
    'p.created_at',
    'p.updated_at',
    'v.id',
    'v.account_number',
    'v.website',
    knex.raw('coalesce(vb.balance, 0)::float as open_balance')
  ]
  return knex
    .with('vendor_balances', qb => qb
      .select('p.id', knex.raw(`
        sum(
          case
            when le.debit_code = '2100'
              then le.amount
            else
              -1 * le.amount
          end
        ) as balance
      `))
      .from('parties as p')
      .join('transactions as t', 'p.id', 't.party_id')
      .join('ledger_entries as le', 't.id', 'le.transaction_id')
      .where('le.debit_code', '2100')
      .orWhere('le.credit_code', '2100')
      .groupBy('p.id')
    )
    .select(columns)
    .from('vendors as v')
    .join('parties as p', 'v.id', 'p.id')
    .leftJoin('vendor_balances as vb', 'p.id', 'vb.id')
}
