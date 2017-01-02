export const up = async ({ schema, raw }) => {
  await schema
    .createTable('items', tb => {
      tb.string('sku')
        .index()
        .unique()
        .notNullable()
      tb.enum('item_type', ['inventory_item'])
        .notNullable()
      tb.primary(['sku', 'item_type'])
      tb.text('description')
      tb.boolean('is_active')
        .notNullable()
        .defaultTo(true)
    })
  await raw('select trigger_timestamps(?)', ['items'])
}

export const down = ({ schema }) =>
  schema
    .dropTable('items')
