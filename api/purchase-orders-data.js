import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function purchaseOrdersData(knex) {

  return camelSql({ create })

  async function create({ id, ...po }) {
    const entity_id = id || uuid()
    const type = 'create_purchase_order'
    const payload = JSON.stringify(po)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(order_id, trx) {
    const purchase_order = ['order_id', 'party_id', 'date']
    const line_items = knex.raw(`json_agg(
      json_build_object(
        'id', l.id,
        'sku', l.sku,
        'quantity', l.quantity,
        'description', l.description,
        'line_total', l.line_total
      )
    ) as line_items`)
    return trx
      .select(...purchase_order, line_items)
      .from('purchase_orders')
      .joinRaw('join purchase_order_line_items as l using (order_id, order_type)')
      .groupBy(...purchase_order)
      .where({ order_id })
      .first()
  }

}
