export const up = ({ schema }) =>
  schema
    .table('service_items', tb => {
      tb.string('revenue_code')
        .index()
        .notNullable()
        .references('code')
        .inTable('accounts')
    })

export const down = ({ schema }) =>
  schema
    .table('service_items', tb => {
      tb.dropColumn('revenue_code')
    })
