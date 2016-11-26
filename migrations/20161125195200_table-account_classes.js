export const up = async ({ schema, raw }) => {
  await schema
    .createTable('account_classes', tb => {
      tb.increments('id')
        .primary()
        .index()
      tb.string('name')
        .unique()
        .notNullable()
    })
  await raw('select trigger_timestamps(?)', ['account_classes'])
}


export const down = ({ schema }) =>
  schema
    .dropTable('account_classes')
