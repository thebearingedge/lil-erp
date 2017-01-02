export const up = ({ schema }) =>
  schema
    .table('shipments', tb => {
      tb.uuid('party_id')
        .notNullable()
        .references('id')
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('shipments', tb => {
      tb.dropColumn('party_id')
    })
