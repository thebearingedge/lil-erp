export const up = async ({ schema, raw }) => {
  await schema
    .createTable('accounts', tb => {
      tb.string('code')
        .primary()
        .unique()
        .notNullable()
      tb.string('parent_code')
      tb.string('name')
        .unique()
        .notNullable()
      tb.text('description')
      tb.enum('class', [
        'asset',
        'liability',
        'equity',
        'revenue',
        'expense'
      ])
      tb.enum('type', [
        'current_assets',
        'cash',
        'accounts_receivable',
        'inventory_assets',
        'fixed_assets',
        'current_liabilities',
        'accounts_payable',
        'credit_cards',
        'long_term_liabilities',
        'shareholders_equity',
        'contributed_capital',
        'shareholder_distributions',
        'retained_earnings',
        'revenue',
        'inventory_sales',
        'services_rendered',
        'other_revenue',
        'cost_of_goods_sold',
        'operating_expenses'
      ])
      tb.unique(['code', 'type'])
      tb.unique(['code', 'class'])
      tb.foreign(['parent_code', 'class'])
        .references(['code', 'class'])
        .inTable('accounts')
        .onUpdate('cascade')
      tb.boolean('is_system_account')
        .notNullable()
        .defaultTo(false)
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })
  await raw('select trigger_timestamps(?)', ['accounts'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('accounts')
