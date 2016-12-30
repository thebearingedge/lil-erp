import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql(__dirname, 'ensure_payment_credit_account_code.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop trigger ensure_payment_credit_account_code on "payments"')
}
