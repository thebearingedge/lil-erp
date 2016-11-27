export const up = async ({ schema, raw }) => {
  await schema
    .createTable('parties', tb => {
      tb.increments('id')
        .primary()
        .index()
      tb.string('name')
        .notNullable()
      tb.text('notes')
    })
}

export const down = ({ schema }) =>
  schema
    .dropTable('parties')
