export const up = ({ schema }) =>
  schema
    .table('accounts', tb => {
      tb.string('parent_code')
        .references('code')
        .inTable('accounts')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('accounts', tb => {
      tb.dropColumn('parent_code')
    })
