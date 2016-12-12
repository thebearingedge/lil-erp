export const up = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.string('sku')
        .notNullable()
        .references('sku')
        .inTable('items')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.dropColumn('sku')
    })
