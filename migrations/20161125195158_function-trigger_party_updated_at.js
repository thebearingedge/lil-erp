import { join } from 'path'
import { readFile } from 'fs-promise'

const readSql = filename => readFile(join(__dirname, `sql/${filename}`), 'utf8')

export const up = async ({ raw }) => {
  await raw(await readSql('party_updated_at.sql'))
  await raw(await readSql('trigger_party_updated_at.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function trigger_party_updated_at(subtype regclass)')
  await raw('drop function party_updated_at()')
}
