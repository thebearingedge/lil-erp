export const up = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.uuid('brand_id')
        .references('id')
        .inTable('brands')
        .onDelete('set null')
    })

export const down = ({ schema }) =>
  schema
    .table('inventory_items', tb => {
      tb.dropColumn('brand_id')
    })
