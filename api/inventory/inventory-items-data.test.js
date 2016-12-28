import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import inventoryItemsData from './inventory-items-data'

describe('inventoryItemsData', () => {

  let trx
  let inventoryItems

  beforeEach(begin(_trx => {
    trx = _trx
    inventoryItems = inventoryItemsData(trx)
  }))

  afterEach(() => rollback(trx))

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
      expect(created).to.include({
        quantityOnPurchaseOrder: 0,
        quantityOnSalesOrder: 0,
        quantityOnHand: 0,
        isActive: true
      })
    })
  })

  describe('find', () => {
    it('lists all inventory items', async () => {
      const list = await inventoryItems.find()
      expect(list).to.have.length.above(0)
      expect(list).to.have.structure([structs.InventoryItem])
    })
  })

})
