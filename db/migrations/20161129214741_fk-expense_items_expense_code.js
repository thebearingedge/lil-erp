export const up = ({ schema }) =>
  schema
    .table('expense_items', tb => {
      tb.string('expense_code')
        .index()
        .notNullable()
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('expense_items', tb => {
      tb.dropColumn('expense_code')
    })
