import { join } from 'path'
import { readFile } from 'fs-promise'

const readSql = filename => readFile(join(__dirname, `sql/${filename}`), 'utf8')

export const up = async ({ raw }) => {
  await raw(await readSql('supertype_updated_at.sql'))
  await raw(await readSql('trigger_supertype_updated_at.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function trigger_supertype_updated_at(subtype regclass, supertype regclass)')
  await raw('drop function supertype_updated_at()')
}
