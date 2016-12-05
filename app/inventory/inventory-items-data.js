import { pick } from 'lodash'
import { camelSql, getItem } from '../util'

function getInventoryItem(doc) {
  return pick(doc, [
    'sku',
    'revenue_code',
    'cost_code',
    'asset_code'
  ])
}

export default function inventoryItemsData(knex) {

  return camelSql({ create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const item = getItem(doc, 'inventory_item')
      const [ sku ] = await trx
        .insert(item)
        .into('items')
        .returning('sku')
      const inventoryItem = getInventoryItem(doc)
      await trx
        .insert(inventoryItem)
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
