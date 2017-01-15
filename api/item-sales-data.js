import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function itemSalesData(knex) {

  return camelSql({ create })

  async function create({ id, ...sale }) {
    const stream_id = id || uuid()
    const event_type ='create_sale'
    const payload = JSON.stringify(sale)
    return knex.transaction(async trx => {
      await trx
        .insert({ stream_id, event_type, payload })
        .into('event_store')
      return findById(stream_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
    const sale = [
      'transaction_id',
      'party_id',
      'trade_account_code',
      'date'
    ]
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
      .select(...sale, line_items)
      .from('trades')
      .joinRaw('join trade_line_items as l using (transaction_id, transaction_type)')
      .groupBy(...sale)
      .where({ transaction_id })
      .first()
  }

}
