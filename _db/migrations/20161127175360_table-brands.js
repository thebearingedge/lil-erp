export const up = async ({ schema, raw }) => {
  await schema
    .createTable('brands', tb => {
      tb.uuid('id')
        .primary()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.string('name')
        .unique()
        .notNullable()
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })
  await raw('select trigger_timestamps(?)', ['brands'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('brands')
