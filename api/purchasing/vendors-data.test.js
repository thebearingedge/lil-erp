import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import vendorsData from './vendors-data'

describe('vendorsData', () => {

  let trx
  let vendors

  beforeEach(begin(_trx => {
    trx = _trx
    vendors = vendorsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('findById', () => {
    it('finds a vendor by id', async () => {
      const { id } = await trx
        .select('id')
        .from('vendors')
        .first()
      const vendor = await vendors.findById(id)
      expect(vendor).to.have.structure(structs.Vendor)
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
    })
  })

})
