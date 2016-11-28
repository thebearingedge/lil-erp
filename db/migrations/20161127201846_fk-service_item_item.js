export const up = async ({ schema, raw }) => {
  await schema
    .table('service_items', tb => {
      tb.enum('item_type', ['service_item'])
        .notNullable()
        .defaultTo('service_item')
      tb.foreign(['sku', 'item_type'])
        .references(['sku', 'item_type'])
        .inTable('items')
    })
  await raw('select trigger_supertype_updated_at(?, ?)', ['service_items', 'items'])
}

export const down = ({ schema }) =>
  schema
    .table('service_items', tb => {
      tb.dropForeign(['sku', 'item_type'])
      tb.dropColumn('item_type')
    })
