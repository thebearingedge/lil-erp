export const up = ({ schema, raw }) =>
  schema
    .createTable('service_items', tb => {
      tb.string('sku')
        .unique()
        .primary()
        .notNullable()
    })

export const down = ({ raw }) =>
  raw('drop table "service_items"')
