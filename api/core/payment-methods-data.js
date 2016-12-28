import { camelSql } from '../util'

export default function paymentMethodsData(knex) {

  return camelSql({ create })

  async function create(method) {
    const [ created ] = await knex
      .insert(method)
      .into('payment_methods')
      .returning('*')
    return created
  }
}
