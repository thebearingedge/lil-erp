import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import journalEntriesData from './journal-entries-data'

describe('journalEntriesData', () => {

  let trx
  let entries

  beforeEach(begin(_trx => {
    trx = _trx
    entries = journalEntriesData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {
    const entry = {
      date: new Date().toJSON(),
      memo: 'Test journal entry.',
      ledgerEntries: [
        { debitCode: '1300', creditCode: '1100', amount: 20000 }
      ]
    }
    it('creates a journal entry', async () => {
      const created = await entries.create(entry)
      expect(created).to.have.structure(structs.JournalEntry)
    })
  })
})
