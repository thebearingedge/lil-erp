export const up = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('revenue_code')
        .index()
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropColumn('revenue_code')
    })
