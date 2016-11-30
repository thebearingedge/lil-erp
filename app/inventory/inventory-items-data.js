import { pick } from 'lodash'
import { camelSql, getItem } from '../util'

function getInventoryItem(obj) {
  return pick(obj, [
    'revenue_code',
    'cost_code',
    'asset_code'
  ])
}

export default function inventoryItemsData(knex) {

  return camelSql({ create })

  async function create(data) {
    return knex.transaction(async trx => {
      const item = getItem(data, 'inventory_item')
      const inventoryItem = getInventoryItem(data)
      const [ sku ] = await trx
        .insert(item)
        .into('items')
        .returning('sku')
      await trx
        .insert({ ...inventoryItem, sku })
        .into('inventory_items')
      return findBySku(sku, trx)
    })
  }

  function findBySku(sku, trx) {
    return trx
      .select('*')
      .from('inventory_items_view')
      .where({ sku })
      .first()
  }
}
