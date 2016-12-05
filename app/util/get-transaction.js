import { pick } from 'lodash'

const transactionProps = [
  'date',
  'memo'
]

export default function getTransaction(doc, transaction_type) {
  return {
    ...pick(doc, transactionProps),
    transaction_type
  }
}
