export const up = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.string('asset_code')
        .notNullable()
        .references('code')
        .inTable('accounts')
    })

export const down = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.dropColumn('asset_code')
    })
