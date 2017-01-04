import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from './__test__'
import { Vendor } from './__fixtures__'
import vendorsData from './vendors-data'

describe('vendorsData', () => {

  let trx
  let vendors

  beforeEach(begin(_trx => {
    trx = _trx
    vendors = vendorsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {

    const vendor = {
      name: 'Bar Corp.',
      accountNumber: 'bar002',
      notes: 'This is where we buy our bars.'
    }

    it('inserts "parties" and "vendors" records', async () => {
      await vendors.create(vendor)
      const partyRecord = await trx
        .select('*')
        .from('parties')
        .where('name', vendor.name)
        .first()
      const vendorRecord = await trx
        .select('*')
        .from('vendors')
        .where('party_id', partyRecord.party_id)
        .first()
      expect(partyRecord).to.exist
      expect(vendorRecord).to.exist
    })

    it('returns the created vendor', async () => {
      const created = await vendors.create(vendor)
      expect(created).to.exist
    })

    it('returns the vendor with the correct structure', async () => {
      const created = await vendors.create(vendor)
      expect(created).to.have.structure(Vendor)
    })

    it('creates the vendor with default properties', async () => {
      const created = await vendors.create(vendor)
      expect(created).to.include({
        ...vendor,
        isActive: true
      })
    })

  })

})
