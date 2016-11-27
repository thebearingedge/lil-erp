export const up = async ({ schema, raw }) => {
  await schema
    .table('vendors', tb => {
      tb.enum('party_type', ['vendor'])
        .notNullable()
        .defaultTo('vendor')
      tb.foreign(['id', 'party_type'])
        .references(['id', 'type'])
        .inTable('parties')
    })
  await raw('select trigger_party_updated_at(?)', ['vendors'])
}

export const down = ({ schema }) =>
  schema
    .table('vendors', tb => {
      tb.dropForeign(['id', 'party_type'])
      tb.dropColumn('party_type')
    })
