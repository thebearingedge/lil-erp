export const up = ({ schema }) =>
  schema
    .table('transactions', tb => {
      tb.uuid('party_id')
        .references('id')
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('transactions', tb => {
      tb.dropColumn('party_id')
    })
