export const up = async ({ schema, raw }) => {
  await schema
    .createTable('transactions', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.enum('type', ['journal_entry', 'shipment', 'payment'])
        .notNullable()
      tb.timestamp('date')
        .notNullable()
      tb.text('memo')
      tb.primary(['id', 'type'])
    })
  await raw('select trigger_timestamps(?)', ['transactions'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('transactions')
