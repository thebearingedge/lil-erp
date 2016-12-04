import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import brandsData from './brands-data'

describe('brandsData', () => {

  let trx
  let brands

  beforeEach(begin(_trx => {
    trx = _trx
    brands = brandsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {
    const brand = { name: 'Super Stuff' }
    it('creates a brand', async () => {
      const created = await brands.create(brand)
      expect(created).to.have.structure(structs.Brand)
    })
  })

})
