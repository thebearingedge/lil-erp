export const up = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.uuid('shipment_line_item_id')
        .references('id')
        .inTable('shipment_line_items')
    })

export const down = ({ schema }) =>
  schema
    .table('stock_moves', tb => {
      tb.dropColumn('shipment_line_item_id')
    })
