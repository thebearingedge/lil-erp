import uuid from 'uuid/V4'
import { camelSql } from './util'

export default function brandsData(knex) {

  return camelSql({ create })

  async function create({ id, ...brand }) {
    const entity_id = id || uuid()
    const type = 'create_brand'
    const payload = JSON.stringify(brand)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(brand_id, trx) {
    return trx
      .select('*')
      .from('brands')
      .where({ brand_id })
      .first()
  }

}
