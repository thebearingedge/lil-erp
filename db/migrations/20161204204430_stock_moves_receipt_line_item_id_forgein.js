export const up = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.uuid('receipt_line_item_id')
        .references('id')
        .inTable('receipt_line_items')
    })

export const down = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.dropColumn('receipt_line_item_id')
    })
