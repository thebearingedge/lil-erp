export const up = ({ schema }) =>
  schema
    .table('account_types', tb => {
      tb.uuid('account_class_id')
        .notNullable()
      tb.enum('account_class_name', ['asset', 'liability', 'equity', 'revenue'])
        .notNullable()
      tb.foreign(['account_class_id', 'account_class_name'])
        .references(['id', 'name'])
        .inTable('account_classes')
    })

export const down = ({ schema }) =>
  schema
    .table('account_types', tb => {
      tb.dropColumn('account_class_name')
    })
