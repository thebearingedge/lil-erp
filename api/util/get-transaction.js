import { pick } from 'lodash'

const transactionProps = [
  'id',
  'date',
  'memo'
]

export default function getTransaction(doc, type) {
  return {
    ...pick(doc, transactionProps),
    type
  }
}
