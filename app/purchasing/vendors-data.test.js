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

  describe('create', () => {
    it('creates a vendor', async () => {
      const vendor = {
        name: 'Foo Corp.',
        accountNumber: 'foo001',
        notes: 'This is where we buy our foos.'
      }
      const created = await vendors.create(vendor)
      expect(created).to.have.structure(structs.Vendor)
      expect(created.contacts).to.have.lengthOf(1)
    })
  })

})
