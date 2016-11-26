export const up = ({ schema }) =>
  schema
    .table('accounts', tb => {
      tb.integer('account_class_id')
        .notNullable()
        .references('id')
        .inTable('account_classes')
    })

export const down = ({ schema }) =>
  schema
    .table('accounts', tb => {
      tb.dropColumn('account_class_id')
    })
