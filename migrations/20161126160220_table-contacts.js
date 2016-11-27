export const up = async ({ schema, raw }) => {
  await schema
    .createTable('contacts', tb => {
      tb.increments('id')
        .primary()
        .index()
      tb.string('name')
        .notNullable()
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })
  await raw('select trigger_timestamps(?)', ['contacts'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('contacts')
