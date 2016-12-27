import { camelSql } from '../util'

export default function brandsData(knex) {

  return camelSql({ create, find })

  async function create(doc) {
    return knex.transaction(async trx => {
      const [ id ] = await trx
        .insert(doc)
        .into('brands')
        .returning('id')
      return findById(id, trx)
    })
  }

  function findById(id, trx) {
    return trx
      .select('*')
      .from('brands')
      .where({ id })
      .first()
  }

  async function find({ name } = {}) {
    const query = knex
      .select('*')
      .from('brands')
    name && query.whereRaw(`name ilike ? || '%'`, [name])
    return await query
  }
}
