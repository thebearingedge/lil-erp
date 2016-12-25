import { join } from 'path'

export const development = {
  client: 'postgresql',
  connection: {
    database: 'lil-erp',
    user: 'lil-erp'
  },
  seeds: {
    directory: join(__dirname, 'seeds/development')
  }
}
