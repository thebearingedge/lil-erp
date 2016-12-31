export const up = async ({ schema, raw }) => {
  await schema
    .createTable('accounts', tb => {
      tb.string('code')
        .primary()
        .unique()
        .notNullable()
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
        'accounts_receivable',
        'accounts_payable'
      ])
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
