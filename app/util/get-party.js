import { pick } from 'lodash'

export default function getParty(obj, party_type) {
  const party = pick(obj, ['name', 'notes', 'is_active'])
  return { ...party, party_type }
}
