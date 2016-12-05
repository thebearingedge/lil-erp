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
    return trx
      .select('*')
      .from('vendors_view')
      .where({ id })
      .first()
  }
}
