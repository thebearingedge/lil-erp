export const up = ({ schema, raw }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('cost_account_code')
        .notNullable()
        .defaultTo(raw('get_default_inventory_cost()'))
      tb.foreign(['cost_account_code', 'cost_account_type'])
        .references(['code', 'type'])
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropForeign(['cost_account_code', 'cost_account_type'])
      tb.dropColumn('cost_account_code')
    })
