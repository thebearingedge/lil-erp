import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import entriesData from './entries-data'

describe('entriesData', () => {

  let trx
  let entries

  beforeEach(begin(_trx => {
    trx = _trx
    entries = entriesData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {
    it('creates an entry', async () => {
      const entry = {
        debitAccountCode: '1100',
        creditAccountCode: '3100',
        amount: 100000
      }
      const created = await entries.create(entry)
      expect(created).to.have.structure(structs.Entry)
    })
  })
})
