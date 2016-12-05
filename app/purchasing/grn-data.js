import { camelSql, getReceipt, getReceiptLineItems } from '../util'

export default function grnData(knex) {

  return camelSql({ create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const receipt = getReceipt(doc, 'goods_received_note')
      const [ receipt_id ] = await trx
        .insert(receipt)
        .into('receipts')
        .returning('id')
      const line_items = getReceiptLineItems(doc, receipt_id, 'goods_received_note')
      await trx
        .insert(line_items)
        .into('receipt_line_items')
      return findById(receipt_id, trx)
    })
  }

  async function findById(id, trx) {
    const goodsReceivedNote = await trx
      .select('*')
      .from('goods_received_notes_view')
      .where({ id })
      .first()
    const lineItems = await trx
      .select('*')
      .from('receipt_line_items_view')
      .where('receipt_id', id)
    return { lineItems, ...goodsReceivedNote }
  }
}
