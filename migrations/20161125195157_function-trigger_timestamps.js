import { join } from 'path'
import { readFile } from 'fs'
import { promisify } from 'bluebird'

const read = promisify(readFile)

export const up = async ({ raw }) => {

  const set_created_at = await read(join(__dirname, '/sql/set_created_at.sql'))
  await raw(set_created_at.toString())

  const set_updated_at = await read(join(__dirname, '/sql/set_updated_at.sql'))
  await raw(set_updated_at.toString())

  const trigger_timestamps = await read(join(__dirname, '/sql/trigger_timestamps.sql'))
  await raw(trigger_timestamps.toString())
}

export const down = async ({ raw }) => {
  await raw('drop function trigger_timestamps(table_name regclass)')
  await raw('drop function set_updated_at()')
  await raw('drop function set_created_at()')
}
