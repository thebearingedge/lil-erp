export const up = ({ schema, raw }) =>
  schema
    .createTable('order_line_items', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.integer('quantity')
        .notNullable()
      tb.text('description')
      tb.decimal('line_total', 10, 2)
        .notNullable()
      tb.boolean('is_closed')
        .notNullable()
        .defaultTo(false)
    })

export const down = ({ schema }) =>
  schema
    .dropTable('order_line_items')
