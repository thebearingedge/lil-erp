import { pick } from 'lodash'

const orderProps = [
  'party_id',
  'number',
  'date',
  'memo'
]

export function getOrder(doc, order_type) {
  return {
    ...pick(doc, orderProps),
    order_type
  }
}

const orderLineItemProps = [
  'sku',
  'quantity',
  'description',
  'line_total',
  'is_closed'
]

export function getOrderLineItems(doc, order_id) {
  return doc.line_items.map(line => ({
    ...pick(line, orderLineItemProps),
    order_id
  }))
}
