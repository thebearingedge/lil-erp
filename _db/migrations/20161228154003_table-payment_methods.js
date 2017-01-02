export const up = async ({ schema, raw }) => {
  await schema
    .createTable('payment_methods', tb => {
      tb.uuid('id')
        .primary()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.string('name')
        .unique()
        .notNullable()
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })
  await raw('select trigger_timestamps(?)', ['payment_methods'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('payment_methods')
