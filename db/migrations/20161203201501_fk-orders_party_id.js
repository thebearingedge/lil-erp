export const up = ({ schema }) =>
  schema
    .table('orders', tb => {
      tb.uuid('party_id')
        .notNullable()
        .references('id')
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('orders', tb => {
      tb.dropColumn('party_id')
    })
