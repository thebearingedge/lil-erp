import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected } from '../__test__'
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
      description: 'A quality widget.'
    }

    it('inserts "items" and "inventory_items" records', async () => {
      await inventoryItems.create(item)
      const itemRecord = await trx
        .select('*')
        .from('items')
        .where('sku', item.sku)
        .first()
      const inventoryItemRecord = await trx
        .select('*')
        .from('inventory_items')
        .where('sku', item.sku)
        .first()
      expect(itemRecord).to.exist
      expect(inventoryItemRecord).to.exist
    })

    it('returns the created inventory item', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.exist
    })

    it('returns the item with the correct structure', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.have.structure(structs.InventoryItem)
    })

    it('creates the item with default accounts', async () => {
      const { inventory_revenue, inventory_cost, inventory_assets } = await trx
        .select(['inventory_revenue', 'inventory_cost', 'inventory_assets'])
        .from('default_accounts')
        .first()
      const created = await inventoryItems.create(item)
      expect(created).to.include({
        revenueAccountCode: inventory_revenue,
        costAccountCode: inventory_cost,
        assetAccountCode: inventory_assets,
      })
    })

    it('creates the item with default properties', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.include({
        quantityOnPurchaseOrder: 0,
        quantityOnSalesOrder: 0,
        quantityOnHand: 0,
        brandName: null,
        isActive: true
      })
    })

    it('does not create inventory items with the same sku', async () => {
      await inventoryItems.create(item)
      const otherItem = { ...item }
      const err = await rejected(inventoryItems.create(otherItem))
      expect(err)
        .to.be.an('error')
        .and.have.property('message')
        .that.includes('items_sku_unique')
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
