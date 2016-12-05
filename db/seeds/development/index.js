import { zipWith } from 'lodash'
import accounts from './accounts'
import brands from './brands'
import vendors from './vendors'
import inventory_items from './inventory-items'
import purchase_orders from './purchase-orders'

export const seed = async knex => {

  const { tables } = await knex
      .select(knex.raw('array_to_json(array_agg(tablename)) as tables'))
      .from('pg_tables')
      .where('schemaname', 'public')
      .whereNot('tablename', 'like', '%migration%')
      .first()

  await knex.raw(`truncate table ${tables} restart identity`)

  await knex
    .insert(accounts)
    .into('accounts')

  const vendor_ids = await knex
    .insert(vendors.map(({ name, party_type }) => ({
      name,
      party_type
    })))
    .into('parties')
    .returning('id')

  await knex
    .insert(zipWith(vendors, vendor_ids, ({ party_type }, id) => ({
      id,
      party_type
    })))
    .into('vendors')
    .returning('id')

  const brand_ids = await knex
    .insert(brands)
    .into('brands')
    .returning('id')

  await knex
    .insert(inventory_items.map(({ sku, description, item_type, }) => ({
      sku,
      description,
      item_type
    })))
    .into('items')
    .returning('sku')

  await knex
    .insert(zipWith(brand_ids, inventory_items, (brand_id, item) => {
      const { sku, item_type, revenue_code, cost_code, asset_code } = item
      return {
        sku,
        item_type,
        revenue_code,
        cost_code,
        asset_code,
        brand_id
      }
    }))
    .into('inventory_items')

  vendor_ids.forEach(async (party_id, i) => {
    const { line_items, ...purchase_order } = purchase_orders[i]
    const [ order_id ] = await knex
      .insert({
        ...purchase_order,
        party_id
      })
      .into('orders')
      .returning('id')
    await knex
      .insert(line_items.map(item => ({
        ...item,
        order_id,
        order_type: 'purchase_order'
      })))
      .into('order_line_items')
  })
}
