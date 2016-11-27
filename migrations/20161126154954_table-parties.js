export const up = async ({ schema, raw }) => {
  await schema
    .createTable('parties', tb => {
      tb.uuid('id')
        .unique()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.enum('type', ['vendor', 'contact'])
      tb.string('name')
        .notNullable()
      tb.text('notes')
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
      tb.primary(['id', 'type'])
    })
  await raw('select trigger_timestamps(?)', ['parties'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('parties')
