export const up = ({ schema }) =>
  schema
    .table('customers', tb => {
      tb.enum('party_type', ['customer'])
        .notNullable()
        .defaultTo('customer')
      tb.foreign(['id', 'party_type'])
        .references(['id', 'party_type'])
        .inTable('parties')
    })

export const down = ({ schema }) =>
  schema
    .table('customers', tb => {
      tb.dropForeign(['id', 'party_type'])
      tb.dropColumn('party_type')
    })
