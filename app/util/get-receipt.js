import { pick } from 'lodash'

const receiptProps = [
  'party_id',
  'number',
  'date',
  'memo'
]

export function getReceipt(doc, receipt_type) {
  return {
    ...pick(doc, receiptProps),
    receipt_type
  }
}

const receiptLineItemProps = [
  'sku',
  'quantity',
  'line_total'
]

export function getReceiptLineItems(doc, receipt_id, receipt_type) {
  return doc.line_items.map(line => ({
    ...pick(line, receiptLineItemProps),
    receipt_id,
    receipt_type
  }))
}
