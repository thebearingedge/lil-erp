import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected } from './__test__'
import { JournalEntry } from './__fixtures__'
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

    it('inserts "transactions", "journal_entries", and "ledger_entries" rows', async () => {
      await entries.create(entry)
      const transactionRow = await trx
        .select('*')
        .from('transactions')
        .first()
      const journalEntryRow = await trx
        .select('*')
        .from('journal_entries')
        .where('transaction_id', transactionRow.transaction_id)
        .first()
      const ledgerEntryRows = await trx
        .select('*')
        .from('ledger_entries')
        .where('transaction_id', transactionRow.transaction_id)
      expect(transactionRow).to.exist
      expect(journalEntryRow).to.exist
      expect(ledgerEntryRows).to.have.lengthOf(1)
    })

    it('inserts a "transactions" record of type "journal_entry"', async () => {
      await entries.create(entry)
      const transactionRecord = await trx
        .select('transaction_type')
        .from('transactions')
        .first()
      expect(transactionRecord).to.include({ transaction_type: 'journal_entry' })
    })

    it('returns the created journal entry', async () => {
      const created = await entries.create(entry)
      expect(created).to.exist
    })

    it('returns the journal entry with the correct structure', async () => {
      const created = await entries.create(entry)
      expect(created).to.have.structure(JournalEntry)
      expect(created.ledgerEntries).to.have.lengthOf(1)
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
        .that.includes('ledger_entries_debit_account_code_fkey')
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
        .that.includes('ledger_entries_credit_account_code_fkey')
    })

  })

})
