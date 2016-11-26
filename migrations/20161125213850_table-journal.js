export const up = async ({ schema, raw }) => {
  await schema
    .createTable('journal', tb => {
      tb.increments('id')
        .primary()
        .index()
      tb.string('debit_account_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
      tb.string('credit_account_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
      tb.timestamp('date')
        .notNullable()
      tb.string('amount')
        .unsigned()
        .notNullable()
      tb.boolean('is_posted')
        .notNullable()
        .defaultTo(false)
    })
  await raw('select trigger_timestamps(?)', ['journal'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('journal')
