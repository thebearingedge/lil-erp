export const up = ({ schema }) =>
  schema
    .table('receipt_line_items', tb => {
      tb.string('sku')
        .notNullable()
        .references('sku')
        .inTable('items')
    })

export const down = ({ schema }) =>
  schema
    .table('receipt_line_items', tb => {
      tb.dropColumn('sku')
    })
