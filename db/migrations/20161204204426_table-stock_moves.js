export const up = ({ schema }) =>
  schema
    .createTable('stock_moves', tb => {
      tb.integer('quantity')
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('stock_moves')
