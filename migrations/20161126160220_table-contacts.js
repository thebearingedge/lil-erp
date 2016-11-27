export const up = ({ schema, raw }) =>
  schema
    .createTable('contacts', tb => {
      tb.uuid('id')
        .unique()
        .primary()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.string('email')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('contacts')
