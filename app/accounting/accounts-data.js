import { camelSql } from '../util'

export default function accountsData(knex) {

  return camelSql({ create, update })

  function create(account) {
    return knex.transaction(async trx => {
      const [ code ] = await trx
        .insert(account)
        .into('accounts')
        .returning('code')
      return findByCode(code, trx)
    })
  }

  function update(code, updates) {
    return knex.transaction(async trx => {
      const [ savedCode ] = await trx
        .update(updates)
        .into('accounts')
        .where({ code })
        .returning('code')
      return findByCode(savedCode, trx)
    })
  }

  function findByCode(code, trx) {
    return trx
      .select('*')
      .from('accounts')
      .where({ code })
      .first()
  }

}
