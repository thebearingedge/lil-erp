import { pick } from 'lodash'

const partyProps = [
  'name',
  'notes',
  'is_active'
]

export default function getParty(doc, party_type) {
  return {
    ...pick(doc, partyProps),
    party_type
  }
}
