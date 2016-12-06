import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql(__dirname, 'create_stock_move_receipt_line_item.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop trigger create_stock_move on "receipt_line_items"')
  await raw('drop function create_stock_move_receipt_line_item()')
}
