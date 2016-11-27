import { formatKeys } from 'deep-clone'
import { camelCase, snakeCase } from 'lodash'

const snakeKeys = formatKeys(snakeCase)
const camelKeys = formatKeys(camelCase)

const wrap = fn => async (...args) => {
  return camelKeys(await fn(...args.map(snakeKeys)))
}

export default function camelSql(obj) {
  return Object.keys(obj).reduce((wrapped, key) => ({
    ...wrapped,
    [key]: wrap(obj[key])
  }), {})
}
