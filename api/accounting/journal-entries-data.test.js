import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected, uuid } from '../__test__'
import { structs } from './__fixtures__'
import journalEntriesData from './journal-entries-data'

describe('journalEntriesData', () => {

  let trx
  let entries

  beforeEach(begin(_trx => {
    trx = _trx
    entries = journalEntriesData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {

    let entry

    beforeEach(async () => {
      const { cash } = await trx
        .select('code as cash')
        .from('accounts')
        .where('type', 'cash')
        .first()
      const { capital } = await trx
        .select('code as capital')
        .from('accounts')
        .where('type', 'contributed_capital')
        .first()
      entry = {
        id: uuid(),
        date: new Date(),
        memo: 'Shut up and take my money!',
        ledgerEntries: [
          {
            debitAccountCode: cash,
            creditAccountCode: capital,
            amount: 20000
          }
        ]
      }
    })

    it('inserts "transactions" and "ledger_entries" records', async () => {
      await entries.create(entry)
      const transactionRecord = await trx
        .select('*')
        .from('transactions')
        .where('id', entry.id)
        .first()
      const ledgerEntryRecords = await trx
        .select('*')
        .from('ledger_entries')
        .where('transaction_id', entry.id)
      expect(transactionRecord).to.exist
      expect(ledgerEntryRecords).to.have.lengthOf(1)
    })

    it('inserts a "transactions" record of type "journal_entry"', async () => {
      await entries.create(entry)
      const transactionRecord = await trx
        .select('type')
        .from('transactions')
        .where('id', entry.id)
        .first()
      expect(transactionRecord).to.include({ type: 'journal_entry' })
    })

    it('returns the created journal entry', async () => {
      const created = await entries.create(entry)
      expect(created).to.exist
    })

    it('returns the journal entry with the correct structure', async () => {
      const created = await entries.create(entry)
      expect(created).to.have.structure(structs.JournalEntry)
    })

    it('does not create journal entries for bad debit accounts', async () => {
      const badEntry = {
        ...entry,
        ledgerEntries: entry.ledgerEntries.map(ledgerEntry => ({
          ...ledgerEntry,
          debitAccountCode: '????'
        }))
      }
      const err = await rejected(entries.create(badEntry))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('ledger_entries_debit_account_code_foreign')
    })

    it('does not create journal entries for bad credit accounts', async () => {
      const badEntry = {
        ...entry,
        ledgerEntries: entry.ledgerEntries.map(ledgerEntry => ({
          ...ledgerEntry,
          creditAccountCode: '????'
        }))
      }
      const err = await rejected(entries.create(badEntry))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('ledger_entries_credit_account_code_foreign')
    })

  })

})
