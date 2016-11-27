export const up = async ({ schema, raw }) => {
  await schema
    .table('contacts', tb => {
      tb.enum('party_type', ['contact'])
        .notNullable()
        .defaultTo('contact')
      tb.foreign(['id', 'party_type'])
        .references(['id', 'type'])
        .inTable('parties')
    })
  await raw('select trigger_party_updated_at(?)', ['contacts'])
}

export const down = ({ schema }) =>
  schema
    .table('contacts', tb => {
      tb.dropForeign(['id', 'party_type'])
      tb.dropColumn('party_type')
    })
