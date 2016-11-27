export const up = ({ schema }) =>
  schema
    .table('vendors', tb => {
      tb.integer('party_id')
        .unique()
        .notNullable()
        .references('id')
        .inTable('parties')
        .onDelete('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('vendors', tb => {
      tb.dropColumn('party_id')
    })
