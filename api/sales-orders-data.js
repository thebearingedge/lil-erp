import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function salesOrdersData(knex) {

  return camelSql({ create })

  async function create({ id, ...order }) {
    const stream_id = id || uuid()
    const event_type ='create_sales_order'
    const payload = JSON.stringify(order)
    return knex.transaction(async trx => {
      await trx
        .insert({ stream_id, event_type, payload })
        .into('event_store')
      return findById(stream_id, trx)
    })
  }

  async function findById(order_id, trx) {
    const sales_order = ['order_id', 'party_id', 'date']
    const line_items = knex.raw(`json_agg(
      json_build_object(
        'line_item_id', l.line_item_id,
        'sku',          l.sku,
        'quantity',     l.quantity,
        'description',  l.description,
        'line_total',   l.line_total
      )
    ) as line_items`)
    return trx
      .select(...sales_order, line_items)
      .from('sales_orders')
      .joinRaw('join sales_order_line_items as l using (order_id, order_type)')
      .groupBy(...sales_order)
      .where({ order_id })
      .first()
  }

}
