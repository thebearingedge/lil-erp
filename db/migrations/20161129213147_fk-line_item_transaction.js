export const up = async ({ schema, raw }) => {
  await schema
    .table('line_items', tb => {
      tb.uuid('transaction_id')
        .index()
        .notNullable()
      tb.enum('transaction_type', ['goods_received_note'])
        .notNullable()
      tb.foreign(['transaction_id', 'transaction_type'])
        .references(['id', 'transaction_type'])
        .inTable('transactions')
    })
  await raw('select trigger_supertype_updated_at(?, ?)', ['line_items', 'transactions'])
}

export const down = ({ schema }) =>
  schema
    .table('line_items', tb => {
      tb.dropForeign(['transaction_id', 'transaction_type'])
      tb.dropColumn('transaction_type')
    })
