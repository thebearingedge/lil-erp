import { describe, beforeEach, afterEach, context, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import brandsData from './brands-data'

describe('brandsData', () => {

  let trx
  let brands

  beforeEach(begin(_trx => {
    trx = _trx
    brands = brandsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {
    const brand = { name: 'Super Stuff' }
    it('creates a brand', async () => {
      const created = await brands.create(brand)
      expect(created).to.have.structure(structs.Brand)
      expect(created).to.include({
        isActive: true
      })
    })
  })

  describe('find', () => {
    context('when no "name" query param is provided', () => {
      it('lists all brands', async () => {
        const found = await brands.find()
        expect(found).to.have.length.above(1)
        expect(found).to.have.structure([structs.Brand])
      })
    })
    context('when a "name" query param is provided', () => {
      it('lists matching brands by name', async () => {
        const found = await brands.find({ name: 'e' })
        expect(found).to.have.length.above(0)
        expect(found).to.have.structure([structs.Brand])
        found.forEach(({ name }) => {
          expect(name).to.match(/^e/i)
        })
      })
    })
  })

})
