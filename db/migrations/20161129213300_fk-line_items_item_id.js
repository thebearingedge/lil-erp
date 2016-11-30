export const up = ({ schema }) =>
  schema
    .table('line_items', tb => {
      tb.string('sku')
        .index()
        .notNullable()
        .references('sku')
        .inTable('items')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('line_items', tb => {
      tb.dropColumn('sku')
    })
