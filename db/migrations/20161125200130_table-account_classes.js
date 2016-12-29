export const up = ({ schema, raw }) =>
  schema
    .createTable('account_classes', tb => {
      tb.uuid('id')
        .primary()
        .notNullable()
        .defaultTo(raw('uuid_generate_v4()'))
      tb.string('name')
        .unique()
        .notNullable()
    })

export const down = ({ schema }) =>
  schema
    .dropTable('account_classes')
