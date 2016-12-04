import { pick } from 'lodash'

export function getOrder(doc, order_type) {
  const order = pick(doc, [
    'party_id',
    'number',
    'date',
    'memo'
  ])
  return { ...order, order_type }
}

export function getOrderLineItems(doc, order_id) {
  return doc.line_items.map(obj => {
    const lineItem = pick(obj, [
      'sku',
      'quantity',
      'description',
      'line_total',
      'is_closed'
    ])
    return { ...lineItem, order_id }
  })
}
