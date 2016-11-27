import { pick } from 'lodash'

export default function getParty(obj, type) {
  const party = pick(obj, ['name', 'notes', 'is_active'])
  return { ...party, type }
}
