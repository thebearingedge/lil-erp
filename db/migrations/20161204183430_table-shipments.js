export const up = async ({ schema, raw }) => {
  await schema
    .createTable('shipments', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.enum('shipment_type', ['goods_received_note', 'invoice'])
      tb.primary(['id', 'shipment_type'])
      tb.text('memo')
      tb.timestamp('date')
        .notNullable()
    })
  await raw('select trigger_timestamps(?)', ['shipments'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('shipments')
