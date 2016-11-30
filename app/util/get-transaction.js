import { pick } from 'lodash'

export default function getTransaction(obj, transaction_type) {
  const transaction = pick(obj, ['date', 'memo'])
  return { ...transaction, transaction_type }
}
