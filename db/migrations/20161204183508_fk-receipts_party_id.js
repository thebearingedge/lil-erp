export const up = ({ schema }) =>
  schema
    .table('receipts', tb => {
      tb.uuid('party_id')
        .notNullable()
        .references('id')
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('receipts', tb => {
      tb.dropColumn('party_id')
    })
