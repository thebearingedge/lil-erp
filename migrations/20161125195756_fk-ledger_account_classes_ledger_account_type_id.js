export const up = ({ schema }) =>
  schema
    .table('account_classes', tb => {
      tb.integer('account_type_id')
        .notNullable()
        .references('id')
        .inTable('account_types')
    })

export const down = ({ schema }) =>
  schema
    .table('account_classes', tb => {
      tb.dropColumn('account_type_id')
    })
