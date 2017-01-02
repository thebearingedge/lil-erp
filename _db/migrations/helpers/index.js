import { join } from 'path'
import { readFile } from 'fs-promise'

export const readSql = filename =>
  readFile(join(__dirname, `../sql/${filename}`), 'utf8')
