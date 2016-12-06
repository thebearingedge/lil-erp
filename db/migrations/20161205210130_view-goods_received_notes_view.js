export const up = knex => {
  const total = knex
    .sum('l.line_total')
    .from('receipt_line_items as l')
    .whereRaw('l.receipt_id = r.id')
    .as('total')
  const columns = [
    'r.id',
    'r.date',
    'r.party_id as vendor_id',
    'r.memo',
    'r.created_at',
    'r.updated_at',
    total
  ]
  const view = knex
    .select(columns)
    .from('receipts as r')
    .join('receipt_line_items as l', 'r.id', 'l.receipt_id')
  return knex.raw(`create view "goods_received_notes_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "goods_received_notes_view"')
