export const up = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('cost_code')
        .index()
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropColumn('cost_code')
    })
