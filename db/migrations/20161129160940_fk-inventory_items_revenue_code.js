export const up = ({ schema, raw }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('revenue_code')
        .index()
        .notNullable()
        .defaultTo(raw('get_default_inventory_revenue()'))
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropColumn('revenue_code')
    })
