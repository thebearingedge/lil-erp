export const up = ({ schema, raw }) =>
  schema
    .createTable('payments', tb => {
      tb.uuid('id')
        .primary()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.decimal('amount', 10, 2)
        .unsigned()
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('payments')
