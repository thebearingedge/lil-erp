export const up = async ({ schema, raw }) => {
  await schema
    .createTable('accounts', tb => {
      tb.string('code')
        .primary()
        .unique()
        .notNullable()
      tb.string('name')
        .unique()
        .notNullable()
      tb.text('description')
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })
  await raw('select trigger_timestamps(?)', ['accounts'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('accounts')
