import { camelSql } from '../util'

export default function brandsData(knex) {

  return camelSql({ create })

  async function create(data) {
    return knex.transaction(async trx => {
      const [ id ] = await trx
        .insert(data)
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
}
