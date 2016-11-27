export const up = ({ schema, raw }) =>
  schema
    .createTable('vendors', tb => {
      tb.uuid('id')
        .unique()
        .primary()
        .notNullable()
      tb.string('account_number')
      tb.string('website')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('vendors')
