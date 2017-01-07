import uuid from 'uuid/v4'
import { camelSql } from './util'

export default function itemReceiptsData(knex) {

  return camelSql({ create })

  async function create({ id, ...receipt }) {
    const entity_id = id || uuid()
    const type = 'create_item_receipt'
    const payload = JSON.stringify(receipt)
    return knex.transaction(async trx => {
      await trx
        .insert({ entity_id, type, payload })
        .into('event_store')
      return findById(entity_id, trx)
    })
  }

  async function findById(transaction_id, trx) {
    const item_receipt = [
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
      .select(...item_receipt, line_items)
      .from('item_receipts')
      .joinRaw('join item_receipt_line_items as l using (transaction_id, transaction_type)')
      .groupBy(...item_receipt)
      .where({ transaction_id })
      .first()
  }

}
