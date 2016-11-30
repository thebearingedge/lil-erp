import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import inventoryItemsData from './inventory-items-data'

describe('inventoryItemsData', () => {

  let trx
  let inventoryItems

  beforeEach(begin(_trx => {
    trx = _trx
    inventoryItems = inventoryItemsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('create', () => {
    const item = {
      sku: 'widget',
      description: 'A quality widget.',
      revenueCode: '4100',
      costCode: '5000',
      assetCode: '1300'
    }
    it('creates a inventory item', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.have.structure(structs.InventoryItem)
    })
  })

})
