export const up = knex => {
  const total = knex
    .sum('l.line_total')
    .from('shipment_line_items as l')
    .whereRaw('l.shipment_id = s.id')
    .as('total')
  const columns = [
    's.id',
    's.date',
    's.party_id',
    's.memo',
    's.created_at',
    's.updated_at',
    total
  ]
  const view = knex
    .select(columns)
    .from('shipments as s')
    .join('shipment_line_items as l', 's.id', 'l.shipment_id')
  return knex.raw(`create view "goods_received_notes_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "goods_received_notes_view"')
