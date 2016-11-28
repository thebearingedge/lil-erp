import { pick } from 'lodash'

export default function getItem(obj, item_type) {
  const item = pick(obj, ['sku', 'description', 'is_active'])
  return { ...item, item_type }
}
