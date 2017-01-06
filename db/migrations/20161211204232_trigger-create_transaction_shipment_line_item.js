import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql('create_transaction_shipment_line_item.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop trigger create_transaction_shipment_line_item on "shipment_line_items"')
  await raw('drop function create_transaction_shipment_line_item()')
}