export const up = async ({ schema, raw }) => {
  await schema
    .createTable('receipts', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.enum('receipt_type', ['goods_received_note'])
      tb.primary(['id', 'receipt_type'])
      tb.text('memo')
      tb.timestamp('date')
        .notNullable()
    })
  await raw('select trigger_timestamps(?)', ['receipts'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('receipts')
