import { join } from 'path'

export const development = {
  client: 'postgresql',
  connection: {
    database: 'mini-erp',
    user: 'mini-erp'
  },
  seeds: {
    directory: join(__dirname, 'seeds/development')
  }
}
