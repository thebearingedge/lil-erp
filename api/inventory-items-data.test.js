import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback, rejected } from './__test__'
import { InventoryItem } from './__fixtures__'
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

    it('inserts "items" and "inventory_items" rows', async () => {
      await inventoryItems.create(item)
      const itemRow = await trx
        .select('*')
        .from('items')
        .where('sku', item.sku)
        .first()
      expect(itemRow).to.be.an('object', 'Item not found')
      const inventoryItemRow = await trx
        .select('*')
        .from('inventory_items')
        .where('sku', item.sku)
        .first()
      expect(inventoryItemRow).to.be.an('object', 'Inventory item not found')
    })

    it('returns the created inventory item', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.exist
    })

    it('returns the item with the correct structure', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.have.structure(InventoryItem)
    })

    it('creates the item with default account codes', async () => {
      const {
        inventory_sales_code,
        inventory_cost_code,
        inventory_assets_code
      } = await trx
        .select(['inventory_sales_code', 'inventory_cost_code', 'inventory_assets_code'])
        .from('default_accounts')
        .first()
      const created = await inventoryItems.create(item)
      expect(created).to.include({
        salesAccountCode: inventory_sales_code,
        costAccountCode: inventory_cost_code,
        assetAccountCode: inventory_assets_code,
      })
    })

    it('creates the item with default properties', async () => {
      const created = await inventoryItems.create(item)
      expect(created).to.include({
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
        .with.property('message')
        .that.includes('violates unique constraint')
    })

  })

})
