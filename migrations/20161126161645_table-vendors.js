export const up = async ({ schema, raw }) => {
  await schema
    .createTable('vendors', tb => {
      tb.increments('id')
        .primary()
        .index()
      tb.string('account_number')
    })
  await raw('select trigger_timestamps(?)', ['vendors'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('vendors')