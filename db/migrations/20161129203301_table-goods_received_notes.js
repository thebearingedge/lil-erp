export const up = ({ schema, raw }) =>
  schema
    .createTable('goods_received_notes', tb => {
      tb.uuid('id')
        .primary()
        .notNullable()
      tb.string('reference_number')
    })

export const down = ({ raw }) =>
  raw('drop table "goods_received_notes"')
