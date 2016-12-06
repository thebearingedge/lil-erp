export const up = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.string('sku')
        .notNullable()
        .references('sku')
        .inTable('items')
    })

export const down = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.dropColumn('sku')
    })
