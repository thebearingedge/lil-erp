export const up = ({ schema, raw }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('revenue_account_code')
        .notNullable()
        .defaultTo(raw('get_default_inventory_revenue()'))
      tb.foreign(['revenue_account_code', 'revenue_account_type'])
        .references(['code', 'type'])
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropForeign(['revenue_account_code', 'revenue_account_type'])
      tb.dropColumn('revenue_account_code')
    })
