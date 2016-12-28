export const up = ({ schema, raw }) =>
  schema
    .createTable('payment_methods', tb => {
      tb.uuid('id')
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.string('name')
        .unique()
        .notNullable()
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })

export const down = ({ schema }) =>
  schema
    .dropTable('payment_methods')
