import { camelSql, getOrder, getOrderLineItems } from '../util'

export default function purchaseOrdersData(knex) {

  return camelSql({ create })

  async function create(doc) {
    return knex.transaction(async trx => {
      const order = getOrder(doc, 'purchase_order')
      const [ order_id ] = await trx
        .insert(order)
        .into('orders')
        .returning('id')
      const line_items = getOrderLineItems(doc, order_id, 'purchase_order')
      await trx
        .insert(line_items)
        .into('order_line_items')
      return findById(order_id, trx)
    })
  }

  async function findById(id, trx) {
    const purchaseOrder = await trx
      .select('*')
      .from('purchase_orders_view')
      .where({ id })
      .first()
    const lineItems = await trx
      .select('*')
      .from('order_line_items_view')
      .where('order_id', id)
    return { lineItems, ...purchaseOrder }
  }
}
