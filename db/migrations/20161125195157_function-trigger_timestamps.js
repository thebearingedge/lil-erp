import { readSql } from './helpers'

export const up = async ({ raw }) => {
  await raw(await readSql(__dirname, 'set_created_at.sql'))
  await raw(await readSql(__dirname, 'keep_created_at.sql'))
  await raw(await readSql(__dirname, 'set_updated_at.sql'))
  await raw(await readSql(__dirname, 'trigger_timestamps.sql'))
}

export const down = async ({ raw }) => {
  await raw('drop function trigger_timestamps(table_name regclass)')
  await raw('drop function set_updated_at()')
  await raw('drop function keep_created_at()')
  await raw('drop function set_created_at()')
}
