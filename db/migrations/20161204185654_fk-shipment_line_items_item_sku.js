export const up = ({ schema }) =>
  schema
    .table('shipment_line_items', tb => {
      tb.string('sku')
        .notNullable()
        .references('sku')
        .inTable('items')
        .onUpdate('cascade')
    })

export const down = ({ schema }) =>
  schema
    .table('shipment_line_items', tb => {
      tb.dropColumn('sku')
    })