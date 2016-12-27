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
    'v.website'
  ]
  return knex
    .select(columns)
    .from('vendors as v')
    .join('parties as p', 'v.id', 'p.id')
}
