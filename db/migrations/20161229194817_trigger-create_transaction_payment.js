import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql(__dirname, 'create_transaction_payment.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop trigger create_transaction_payment on "payments"')
  await raw('drop function create_transaction_payment()')
}
