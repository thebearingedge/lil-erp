export const up = ({ schema, raw }) =>
  schema
    .createTable('parties_contacts', tb => {
      tb.uuid('party_id')
        .notNullable()
        .references('id')
        .inTable('parties')
        .onDelete('cascade')
      tb.uuid('contact_id')
        .notNullable()
        .references('id')
        .inTable('contacts')
        .onDelete('cascade')
      tb.unique(['party_id', 'contact_id'])
    })

export const down = ({ schema }) =>
  schema
    .dropTable('parties_contacts')
