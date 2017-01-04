import { join } from 'path'
import { readFile } from 'fs'

export const readSql = filename => new Promise((resolve, reject) => {
  readFile(join(__dirname, `../sql/${filename}`), 'utf8', (err, data) => {
    if (err) return reject(err)
    resolve(data)
  })
})
