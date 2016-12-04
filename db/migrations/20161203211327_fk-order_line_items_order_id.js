export const up = ({ schema }) =>
  schema
    .table('order_line_items', tb => {
      tb.uuid('order_id')
        .notNullable()
        .references('id')
        .inTable('orders')
    })

export const down = ({ schema }) =>
  schema
    .table('order_line_items', tb => {
      tb.dropColumn('order_id')
    })
