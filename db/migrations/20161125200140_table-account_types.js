export const up = ({ schema }) =>
  schema
    .createTable('account_types', tb => {
      tb.string('code')
        .primary()
        .unique()
        .notNullable()
      tb.string('name')
        .unique()
        .notNullable()
      tb.text('description')
    })

export const down = ({ schema }) =>
  schema
    .dropTable('account_types')
