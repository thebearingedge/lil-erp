export const up = ({ schema }) =>
  schema
    .createTable('inventory_items', tb => {
      tb.string('sku')
        .unique()
        .primary()
        .notNullable()
      tb.enum('revenue_account_type', ['inventory_sales'])
        .notNullable()
        .defaultTo('inventory_sales')
      tb.enum('cost_account_type', ['cost_of_goods_sold'])
        .notNullable()
        .defaultTo('cost_of_goods_sold')
      tb.enum('asset_account_type', ['inventory_assets'])
        .notNullable()
        .defaultTo('inventory_assets')
    })

export const down = ({ raw }) =>
  raw('drop table "inventory_items"')
