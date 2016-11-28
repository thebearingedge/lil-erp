import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import serviceItemsData from './service-items-data'

describe('serviceItemsData', () => {

  let trx
  let serviceItems

  beforeEach(begin(_trx => {
    trx = _trx
    serviceItems = serviceItemsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {
    const service = {
      sku: 'footrub',
      description: 'Rubbin da feeet.',
      revenueCode: '4200'
    }
    it('creates a service item', async () => {
      const created = await serviceItems.create(service)
      expect(created).to.have.structure(structs.ServiceItem)
    })
  })

})
