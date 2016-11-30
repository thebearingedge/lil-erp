export const up = ({ schema }) =>
  schema
    .table('goods_received_notes', tb => {
      tb.uuid('vendor_id')
        .index()
        .notNullable()
        .references('id')
        .inTable('vendors')
    })

export const down = ({ schema }) =>
  schema
    .table('goods_received_notes', tb => {
      tb.dropColumn('vendor_id')
    })
