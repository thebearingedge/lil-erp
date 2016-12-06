import { join } from 'path'
import { readFile } from 'fs-promise'

export const readSql = (migrationPath, filename) =>
  readFile(join(migrationPath, `sql/${filename}`), 'utf8')
