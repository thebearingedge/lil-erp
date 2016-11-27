export const up = ({ schema, raw }) =>
  schema
    .createTable('contacts', tb => {
      tb.uuid('id')
        .unique()
        .primary()
        .notNullable()
      tb.string('email')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('contacts')
