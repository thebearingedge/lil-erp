import { formatKeys } from 'deep-clone'
import { camelCase, snakeCase, isFunction } from 'lodash'

const snakeKeys = formatKeys(snakeCase)
const camelKeys = formatKeys(camelCase)
const wrap = fn => async (...args) => {
  return camelKeys(await fn(...args.map(snakeKeys)))
}

export default function camelSql(obj) {
  if (isFunction(obj)) return wrap(obj)
  return Object.keys(obj).reduce((wrapped, key) => ({
    ...wrapped,
    [key]: wrap(obj[key])
  }), {})
}
