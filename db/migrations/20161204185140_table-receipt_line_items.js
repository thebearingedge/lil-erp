export const up = ({ schema, raw }) =>
  schema
    .createTable('receipt_line_items', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.integer('quantity')
        .notNullable()
      tb.text('description')
      tb.decimal('line_total', 10, 2)
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('receipt_line_items')
