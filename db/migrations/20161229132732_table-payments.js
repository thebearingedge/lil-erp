export const up = ({ schema, raw }) =>
  schema
    .createTable('payments', tb => {
      tb.uuid('id')
        .primary()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.timestamp('date')
        .notNullable()
        .defaultTo(raw('now()'))
        .notNullable()
      tb.decimal('amount', 10, 2)
        .unsigned()
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('payments')
