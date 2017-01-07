import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function inventoryItemsData(knex) {

  return camelSql({ create })

  async function create({ id, ...item }) {
    const entity_id = id || uuid()
    const type = 'create_inventory_item'
    const payload = JSON.stringify(item)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(item_id, trx) {
    const item = [
      'i.item_id',
      'i.sku',
      'i.description',
      'i.is_active'
    ]
    const brand = ['b.brand_name']
    const inventory_item = [
      'ii.sales_account_code',
      'ii.cost_account_code',
      'ii.asset_account_code'
    ]
    return trx
      .select(...item, ...brand, ...inventory_item)
      .from('inventory_items as ii')
      .joinRaw('join items as i using (item_id, item_type, sku)')
      .joinRaw('left join brands as b using (brand_id)')
      .where({ item_id })
      .first()
  }

}
