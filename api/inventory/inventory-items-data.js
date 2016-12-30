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

  return camelSql({ create, find })

  async function create(doc) {
    return knex.transaction(async trx => {
      const item = getItem(doc, 'inventory_item')
      const [ sku ] = await trx
        .insert(item)
        .into('items')
        .returning('sku')
      const inventory_item = getInventoryItem(doc)
      await trx
        .insert(inventory_item)
        .into('inventory_items')
      return findBySku(sku, trx)
    })
  }

  async function findBySku(sku, trx) {
    return inventoryItemsView(trx)
      .where('i.sku', sku)
      .first()
  }

  async function find() {
    return inventoryItemsView(knex)
  }

}

function inventoryItemsView(knex) {
  const inventory_item = [
    'i.sku',
    'i.description',
    'i.is_active',
    'i.created_at',
    'i.updated_at',
    'ii.revenue_code',
    'ii.cost_code',
    'ii.asset_code',
    'b.name as brand_name'
  ]
  const on_purchase_order = knex
    .select(knex.raw('coalesce(sum(l.quantity), 0)::integer'))
    .from('order_line_items as l')
    .whereRaw(`l.sku = ii.sku and l.order_type = 'purchase_order'`)
    .as('quantity_on_purchase_order')
  const on_sales_order = knex
    .select(knex.raw('coalesce(sum(l.quantity), 0)::integer'))
    .from('order_line_items as l')
    .whereRaw(`l.sku = ii.sku and l.order_type = 'sales_order'`)
    .as('quantity_on_sales_order')
  const on_hand = knex.raw(`coalesce((${
      knex
        .select('s.quantity_on_hand')
        .from('stock_moves as s')
        .whereRaw('s.sku = ii.sku')
        .orderBy('s.shipment_date', 'desc')
        .orderBy('s.created_at', 'desc')
        .limit(1)
    }), 0)::integer as quantity_on_hand`)
  return knex
    .select([...inventory_item, on_purchase_order, on_sales_order, on_hand])
    .from('inventory_items as ii')
    .join('items as i', 'ii.sku', 'i.sku')
    .leftJoin('brands as b', 'ii.brand_id', 'b.id')
}
