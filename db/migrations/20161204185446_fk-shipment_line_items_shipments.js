export const up = ({ schema }) =>
  schema
    .table('shipment_line_items', tb => {
      tb.uuid('shipment_id')
        .notNullable()
        .references('id')
        .inTable('shipments')
      tb.enum('shipment_type', ['goods_received_note'])
        .notNullable()
      tb.foreign(['shipment_id', 'shipment_type'])
        .references(['id', 'shipment_type'])
        .inTable('shipments')
    })

export const down = ({ schema }) =>
  schema
    .table('shipment_line_items', tb => {
      tb.dropForeign(['shipment_id', 'shipment_type'])
      tb.dropColumn('shipment_id')
      tb.dropColumn('shipment_type')
    })
