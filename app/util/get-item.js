import { pick } from 'lodash'

const itemProps = [
  'sku',
  'description',
  'is_active'
]

export default function getItem(doc, item_type) {
  const item = pick(doc, itemProps)
  return { ...item, item_type }
}
