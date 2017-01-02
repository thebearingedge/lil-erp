/* eslint-disable no-console */
import { zipWith, pick } from 'lodash'
import { mapSeries } from 'bluebird'
import systemSeed from '../system'
import accounts from './accounts'
import journal_entries from './journal-entries'
import brands from './brands'
import vendors from './vendors'
import inventory_items from './inventory-items'
import purchase_orders from './purchase-orders'
import item_receipts from './item-receipts'
import customers from './customers'
import sales_orders from './sales-orders'
import item_sales from './item-sales'
import payment_methods from './payment-methods'
import payments from './payments'

export const seed = async knex => {

  knex.on('query-error', (err, details) => {
    console.error(err)
    console.log(JSON.stringify(details, null, 2))
  })

  const { tables } = await knex
      .select(knex.raw('array_to_json(array_agg(tablename)) as tables'))
      .from('pg_tables')
      .where('schemaname', 'public')
      .whereNot('tablename', 'like', '%migration%')
      .first()

  await knex.raw(`truncate table ${tables} restart identity`)

  await systemSeed(knex)

  await knex
    .insert(accounts)
    .into('accounts')

  await mapSeries(journal_entries, async ({ ledger_entries, ...journal }) => {
    const [ transaction_id ] = await knex
      .insert({ type: 'journal_entry', ...journal })
      .into('transactions')
      .returning('id')
    await mapSeries(ledger_entries, ledger =>
      knex
        .insert({ transaction_id, ...ledger })
        .into('ledger_entries')
    )
  })

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

  await knex
    .insert(zipWith(brand_ids, inventory_items, (brand_id, item) => ({
      brand_id,
      ...pick(item, [
        'sku',
        'item_type',
        'revenue_account_code',
        'cost_account_code',
        'asset_account_code'
      ])
    })))
    .into('inventory_items')

  const vendor_ids = await knex
    .insert(vendors)
    .into('parties')
    .returning('id')

  await knex
    .insert(zipWith(vendors, vendor_ids, ({ party_type }, id) => ({
      id,
      party_type
    })))
    .into('vendors')
    .returning('id')

  const po_line_item_ids = await mapSeries(vendor_ids, async (party_id, i) => {
    const { line_items, ...order } = purchase_orders[i]
    const [ order_id ] = await knex
      .insert({ ...order, party_id })
      .into('orders')
      .returning('id')
    const [ order_line_item_id ] = await knex
      .insert(line_items.map(item => ({
        ...item,
        order_id,
        order_type: 'purchase_order'
      })))
      .into('order_line_items')
      .returning('id')
    return order_line_item_id
  })

  await mapSeries(item_receipts, async item_receipt => {
    const { line_items, ...shipment } = item_receipt
    const party_id = vendor_ids[0]
    const [ shipment_id ] = await knex
      .insert({ ...shipment, party_id })
      .into('shipments')
      .returning('id')
    await knex
      .insert(line_items.map(item => ({
        ...item,
        sku: purchase_orders[0].line_items[0].sku,
        shipment_id,
        shipment_type: 'item_receipt',
        order_line_item_id: po_line_item_ids[0]
      })))
      .into('shipment_line_items')
  })

  const customer_ids = await knex
    .insert(customers)
    .into('parties')
    .returning('id')

  await knex
    .insert(zipWith(customers, customer_ids, ({ party_type }, id) => ({
      id,
      party_type
    })))
    .into('customers')

  const so_line_item_ids = await mapSeries(customer_ids, async (party_id, i) => {
    const { line_items, ...order } = sales_orders[i]
    const [ order_id ] = await knex
      .insert({ ...order, party_id })
      .into('orders')
      .returning('id')
    const [ order_line_item_id ] = await knex
      .insert(line_items.map(item => ({
        ...item,
        order_id,
        order_type: 'sales_order'
      })))
      .into('order_line_items')
      .returning('id')
    return order_line_item_id
  })

  await mapSeries(item_sales, async (item_sale, i) => {
    const { line_items, ...shipment } = item_sale
    const party_id = customer_ids[i]
    const [ shipment_id ] = await knex
      .insert({ ...shipment, party_id })
      .into('shipments')
      .returning('id')
    await knex
      .insert(line_items.map(item => ({
        ...item,
        sku: sales_orders[0].line_items[0].sku,
        shipment_id,
        shipment_type: 'item_sale',
        order_line_item_id: so_line_item_ids[0]
      })))
      .into('shipment_line_items')
  })

  const payment_method_ids = await knex
    .insert(payment_methods)
    .into('payment_methods')
    .returning('id')

  await knex
    .insert({
      ...payments[0],
      party_id: customer_ids[0],
      payment_method_id: payment_method_ids[0],
      payment_account_code: '1110'
    })
    .into('payments')

  await knex
    .insert({
      ...payments[1],
      party_id: vendor_ids[0],
      payment_method_id: payment_method_ids[0],
      payment_account_code: '1110'
    })
    .into('payments')
}