import { describe, beforeEach, afterEach, context, it } from 'global'
import { begin, expect, rollback, rejected } from '../__test__'
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

    const brand = { name: 'Initech' }

    it('inserts a "brands" record', async () => {
      await brands.create(brand)
      const record = await trx
        .select('*')
        .from('brands')
        .where('name', brand.name)
        .first()
      expect(record).to.exist
    })

    it('returns the created brand', async () => {
      const created = await brands.create(brand)
      expect(created).to.exist
    })

    it('returns the brand with the correct structure', async () => {
      const created = await brands.create(brand)
      expect(created).to.have.structure(structs.Brand)
    })

    it('creates the brand with default properties', async () => {
      const created = await brands.create(brand)
      expect(created).to.include({
        isActive: true
      })
    })

    it('does not create brands with the same name', async () => {
      await brands.create(brand)
      const otherBrand = { ...brand }
      const err = await rejected(brands.create(otherBrand))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('brands_name_unique')
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
