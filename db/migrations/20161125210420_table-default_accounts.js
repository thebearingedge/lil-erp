export const up = ({ schema }) =>
  schema
    .createTable('default_accounts', tb => {
      tb.string('inventory_revenue')
        .notNullable()
        .references('code')
        .inTable('accounts')
      tb.string('cost_of_goods_sold')
        .notNullable()
        .references('code')
        .inTable('accounts')
      tb.string('inventory_assets')
        .notNullable()
        .references('code')
        .inTable('accounts')
      tb.string('accounts_receivable')
        .notNullable()
        .references('code')
        .inTable('accounts')
      tb.string('accounts_payable')
        .notNullable()
        .references('code')
        .inTable('accounts')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('default_accounts')