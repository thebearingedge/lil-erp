export const up = async ({ schema, raw }) => {
  await schema
    .table('goods_received_notes', tb => {
      tb.enum('transaction_type', ['goods_received_note'])
        .notNullable()
        .defaultTo('goods_received_note')
      tb.foreign(['id', 'transaction_type'])
        .references(['id', 'transaction_type'])
        .inTable('transactions')
    })
  await raw('select trigger_supertype_updated_at(?, ?)', ['goods_received_notes', 'transactions'])
}

export const down = ({ schema }) =>
  schema
    .table('goods_received_notes', tb => {
      tb.dropForeign(['id', 'transaction_type'])
      tb.dropColumn('transaction_type')
    })
