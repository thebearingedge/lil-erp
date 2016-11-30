export const up = ({ schema }) =>
  schema
    .createTable('line_items', tb => {
      tb.text('description')
      tb.integer('quantity')
        .notNullable()
        .defaultTo(0)
      tb.integer('total_price')
        .notNullable()
        .defaultTo(0)
    })

export const down = ({ schema }) =>
  schema
    .dropTable('line_items')
