export const up = async ({ schema, raw }) => {
  await schema
    .table('vendors', tb => {
      tb.uuid('party_id')
        .notNullable()
      tb.enum('party_type', ['vendor'])
        .notNullable()
        .defaultTo('vendor')
      tb.foreign(['party_id', 'party_type'])
        .references(['id', 'type'])
        .inTable('parties')
    })
  await raw('select trigger_party_updated_at(?)', ['vendors'])
}

export const down = ({ schema }) =>
  schema
    .table('vendors', tb => {
      tb.dropForeign(['party_id', 'party_type'])
      tb.dropColumn('party_id')
      tb.dropColumn('party_type')
    })
