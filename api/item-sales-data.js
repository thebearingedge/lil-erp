import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function itemSalesData(knex) {

  return camelSql({ create })

  async function create({ id, ...sale }) {
    const entity_id = id || uuid()
    const type = 'create_item_sale'
    const payload = JSON.stringify(sale)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
    const item_sale = [
      'transaction_id',
      'party_id',
      'trade_account_code',
      'date'
    ]
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
      .select(...item_sale, line_items)
      .from('item_sales')
      .joinRaw('join item_sale_line_items as l using (transaction_id, transaction_type)')
      .groupBy(...item_sale)
      .where({ transaction_id })
      .first()
  }

}
