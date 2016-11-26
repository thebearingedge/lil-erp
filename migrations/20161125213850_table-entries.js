export const up = async ({ schema, raw }) => {
  await schema
    .createTable('entries', tb => {
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
        .defaultTo(raw('now()'))
      tb.integer('amount')
        .unsigned()
        .notNullable()
    })
  await raw('select trigger_timestamps(?)', ['entries'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('entries')
