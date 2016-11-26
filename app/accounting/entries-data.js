import { camelSql } from '../util'

export default function entriesData(knex) {

  return camelSql({ create })

  function create(entry) {
    return knex.transaction(async trx => {
      const [ id ] = await trx
        .insert(entry)
        .into('entries')
        .returning('id')
      return findById(id, trx)
    })
  }

  function findById(id, trx) {
    return trx
      .select('*')
      .from('entries')
      .where({ id })
      .first()
  }
}
