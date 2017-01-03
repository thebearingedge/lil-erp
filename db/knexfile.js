import { join } from 'path'

export const development = {
  client: 'postgresql',
  connection: {
    database: 'lil-erp'
  },
  seeds: {
    directory: join(__dirname, 'seeds/development')
  }
}

export const integration = {
  ...development
}
