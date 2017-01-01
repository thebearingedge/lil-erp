export const up = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.uuid('party_id')
        .notNullable()
        .references('id')
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.dropColumn('party_id')
    })
