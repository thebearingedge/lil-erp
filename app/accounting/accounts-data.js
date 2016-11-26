import { camelSql } from '../util'

export default function accountsData(knex) {

  return camelSql({ findByCode })

  function findByCode(code) {
    return knex
      .select('*')
      .from('accounts')
      .where({ code })
      .first()
  }

}
