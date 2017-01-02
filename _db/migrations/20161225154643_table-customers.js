export const up = ({ schema }) =>
  schema
    .createTable('customers', tb => {
      tb.uuid('id')
        .unique()
        .primary()
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('customers')
