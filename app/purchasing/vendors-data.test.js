import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import vendorsData from './vendors-data'

describe('vendorsData', () => {

  let trx
  let vendors

  beforeEach(begin(_trx => {
    trx = _trx
    vendors = vendorsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('findById', () => {
    it('finds a vendor by id', async () => {
      const vendor = await vendors.findById(1)
      expect(vendor).to.have.structure(structs.Vendor)
      expect(vendor.contacts).to.have.lengthOf(1)
    })
  })

  describe('create', () => {
    it('creates a vendor', async () => {
      const vendor = {
        name: 'Bar Corp.',
        accountNumber: 'bar002',
        notes: 'This is where we buy our bars.'
      }
      const created = await vendors.create(vendor)
      expect(created).to.have.structure(structs.Vendor)
      expect(created.contacts).to.have.lengthOf(1)
    })
  })

})
