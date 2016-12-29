export const up = ({ schema }) =>
  schema
    .table('accounts', tb => {
      tb.uuid('account_class_id')
      tb.enum('account_class_name', [
        'asset', 'liability', 'equity', 'revenue', 'expense'
      ])
      tb.foreign(['account_class_id', 'account_class_name'])
        .references(['id', 'name'])
        .inTable('account_classes')
    })

export const down = ({ schema }) =>
  schema
    .table('accounts', tb => {
      tb.dropForeign(['account_class_id', 'account_class_name'])
      tb.dropColumn('account_class_name')
      tb.dropColumn('account_class_id')
    })
