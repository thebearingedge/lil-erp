import { pick } from 'lodash'
import { camelSql, getItem } from '../util'

function getServiceItem(obj) {
  return pick(obj, ['revenue_code'])
}

export default function serviceItemsData(knex) {

  return camelSql({ create })

  async function create(data) {
    return knex.transaction(async trx => {
      const item = getItem(data, 'service_item')
      const serviceItem = getServiceItem(data)
      const [ sku ] = await trx
        .insert(item)
        .into('items')
        .returning('sku')
      await trx
        .insert({ ...serviceItem, sku })
        .into('service_items')
      return findBySku(sku, trx)
    })
  }

  function findBySku(sku, trx) {
    return trx
      .select('*')
      .from('service_items_view')
      .where({ sku })
      .first()
  }
}
