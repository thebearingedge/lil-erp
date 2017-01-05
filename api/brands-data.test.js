import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected } from './__test__'
import { Brand } from './__fixtures__'
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

    const brand = { brandName: 'Initech' }

    it('inserts a "brands" row', async () => {
      await brands.create(brand)
      const brandRow = await trx
        .select('*')
        .from('brands')
        .where('brand_name', brand.brandName)
        .first()
      expect(brandRow).to.exist
    })

    it('returns the created brand', async () => {
      const created = await brands.create(brand)
      expect(created).to.exist
    })

    it('returns the brand with the correct structure', async () => {
      const created = await brands.create(brand)
      expect(created).to.have.structure(Brand)
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
        .that.includes('brands_brand_name_key')
    })

  })

})
