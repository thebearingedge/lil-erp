export const up = ({ schema }) =>
  schema
    .table('receipt_line_items', tb => {
      tb.uuid('receipt_id')
        .notNullable()
        .references('id')
        .inTable('receipts')
      tb.enum('receipt_type', ['goods_received_note'])
        .notNullable()
      tb.foreign(['receipt_id', 'receipt_type'])
        .references(['id', 'receipt_type'])
        .inTable('receipts')
    })

export const down = ({ schema }) =>
  schema
    .table('receipt_line_items', tb => {
      tb.dropForeign(['receipt_id', 'receipt_type'])
      tb.dropColumn('receipt_id')
      tb.dropColumn('receipt_type')
    })
