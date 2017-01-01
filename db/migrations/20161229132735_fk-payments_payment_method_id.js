export const up = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.uuid('payment_method_id')
        .notNullable()
        .references('id')
        .inTable('payment_methods')
    })

export const down = ({ schema }) =>
  schema
    .table('payments', tb => {
      tb.dropColumn('payment_method_id')
    })
