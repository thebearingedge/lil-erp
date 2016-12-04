export const up = ({ schema }) =>
  schema
    .table('order_line_items', tb => {
      tb.string('sku')
        .references('sku')
        .inTable('items')
    })

export const down = ({ schema }) =>
  schema
    .table('order_line_items', tb => {
      tb.dropColumn('sku')
    })
