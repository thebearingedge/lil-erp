export const up = async ({ schema, raw }) => {
  await schema
    .table('inventory_items', tb => {
      tb.enum('item_type', ['inventory_item'])
        .notNullable()
        .defaultTo('inventory_item')
      tb.foreign(['sku', 'item_type'])
        .references(['sku', 'item_type'])
        .inTable('items')
    })
  await raw('select trigger_supertype_updated_at(?, ?)', ['inventory_items', 'items'])
}

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropForeign(['sku', 'item_type'])
      tb.dropColumn('item_type')
    })
