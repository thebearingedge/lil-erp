export const up = ({ schema }) =>
  schema
    .table('vendors', tb => {
      tb.enum('party_type', ['vendor'])
        .notNullable()
        .defaultTo('vendor')
      tb.foreign(['id', 'party_type'])
        .references(['id', 'party_type'])
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('vendors', tb => {
      tb.dropForeign(['id', 'party_type'])
      tb.dropColumn('party_type')
    })
