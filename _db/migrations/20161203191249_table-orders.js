export const up = async ({ schema, raw }) => {
  await schema
    .createTable('orders', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.enum('order_type', ['purchase_order', 'sales_order'])
      tb.primary(['id', 'order_type'])
      tb.text('memo')
      tb.timestamp('date')
        .notNullable()
      tb.boolean('is_closed')
        .notNullable()
        .defaultTo(false)
    })
  await raw('select trigger_timestamps(?)', ['orders'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('orders')
