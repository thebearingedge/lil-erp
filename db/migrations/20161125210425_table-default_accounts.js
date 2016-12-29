export const up = ({ schema }) =>
  schema
    .createTable('default_accounts', tb => {
      tb.string('inventory_revenue')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
      tb.string('inventory_cost')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
      tb.string('inventory_assets')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
      tb.string('trade_receivable')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
      tb.string('trade_payable')
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('default_accounts')
