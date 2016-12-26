export const up = ({ schema }) =>
  schema
    .table('order_line_items', tb => {
      tb.uuid('order_id')
        .notNullable()
        .references('id')
        .inTable('orders')
      tb.enum('order_type', ['purchase_order', 'sales_order'])
        .notNullable()
      tb.foreign(['order_id', 'order_type'])
        .references(['id', 'order_type'])
        .inTable('orders')
    })

export const down = ({ schema }) =>
  schema
    .table('order_line_items', tb => {
      tb.dropForeign(['order_id', 'order_type'])
      tb.dropColumn('order_id')
      tb.dropColumn('order_type')
    })
