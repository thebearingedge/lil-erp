export const up = ({ schema, raw }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('cost_code')
        .index()
        .notNullable()
        .defaultTo(raw('get_default_inventory_cost()'))
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropColumn('cost_code')
    })
