export const up = ({ schema, raw }) =>
  schema
    .table('inventory_items', tb => {
      tb.string('asset_account_code')
        .notNullable()
        .defaultTo(raw('get_default_inventory_assets()'))
      tb.foreign(['asset_account_code', 'asset_account_type'])
        .references(['code', 'type'])
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropForeign(['asset_account_code', 'asset_account_type'])
      tb.dropColumn('asset_account_code')
    })
