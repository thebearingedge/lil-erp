export const up = async ({ schema, raw }) => {
  await schema
    .createTable('account_types', tb => {
      tb.increments('id')
      .primary()
      .index()
      tb.string('name')
      .unique()
      .notNullable()
    })
  await raw('select trigger_timestamps(?)', ['account_types'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('account_types')
