export const up = ({ schema }) =>
  schema
    .createTable('inventory_items', tb => {
      tb.string('sku')
        .unique()
        .primary()
        .notNullable()
    })

export const down = ({ raw }) =>
  raw('drop table "inventory_items"')
