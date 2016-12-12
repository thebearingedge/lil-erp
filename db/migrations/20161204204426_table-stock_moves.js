export const up = async ({ schema, raw }) => {
  await schema
    .createTable('stock_moves', tb => {
      tb.integer('quantity')
        .notNullable()
      tb.timestamp('receipt_date')
        .notNullable()
      tb.decimal('average_cost', 13, 5)
      tb.integer('quantity_on_hand')
    })
  await raw('select trigger_timestamps(?)', ['stock_moves'])
}


export const down = ({ schema }) =>
  schema
    .dropTable('stock_moves')
