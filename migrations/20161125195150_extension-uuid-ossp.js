export const up = ({ raw }) =>
  raw('create extension "uuid-ossp"')

export const down = ({ raw }) =>
  raw('drop extension "uuid-ossp"')
