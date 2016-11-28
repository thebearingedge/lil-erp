import { pick } from 'lodash'

export default function getTransaction(obj, type) {
  const transaction = pick(obj, ['date', 'memo'])
  return { ...transaction, type }
}
