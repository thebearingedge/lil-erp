import { join } from 'path'
import { readFile } from 'fs-promise'

const readSql = filename => readFile(join(__dirname, `sql/${filename}`), 'utf8')

export const up = async ({ raw }) => {
  await raw(await readSql('set_created_at.sql'))
  await raw(await readSql('set_updated_at.sql'))
  await raw(await readSql('trigger_timestamps.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function trigger_timestamps(table_name regclass)')
  await raw('drop function set_updated_at()')
  await raw('drop function set_created_at()')
}
