export const up = ({ schema }) =>
  schema
    .table('receipt_line_items', tb => {
      tb.uuid('order_line_item_id')
        .references('id')
        .inTable('order_line_items')
    })

export const down = ({ schema }) =>
  schema
    .table('receipt_line_items', tb => {
      tb.dropColumn('order_line_item_id')
    })
