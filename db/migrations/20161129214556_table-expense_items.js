export const up = ({ schema }) =>
  schema
    .createTable('expense_items', tb => {
      tb.text('memo')
      tb.integer('amount')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('expense_items')
