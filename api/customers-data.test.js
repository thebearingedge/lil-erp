import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from './__test__'
import { Customer } from './__fixtures__'
import customersData from './customers-data'

describe('customersData', () => {

  let trx
  let customers

  beforeEach(begin(_trx => {
    trx = _trx
    customers = customersData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {

    const customer = {
      name: 'Denis Mgulumbwa',
      notes: 'Hello... My name is Denis'
    }

    it('inserts "parties" and "customers" records', async () => {
      await customers.create(customer)
      const partyRecord = await trx
        .select('*')
        .from('parties')
        .where('name', customer.name)
        .first()
      const customerRecord = await trx
        .select('*')
        .from('customers')
        .where('id', partyRecord.id)
        .first()
      expect(partyRecord).to.exist
      expect(customerRecord).to.exist
    })

    it('returns the created customer', async () => {
      const created = await customers.create(customer)
      expect(created).to.exist
    })

    it('returns the customer with the correct structure', async () => {
      const created = await customers.create(customer)
      expect(created).to.have.structure(Customer)
    })
    
    it('creates a customer with default properties', async () => {
      const created = await customers.create(customer)
      expect(created).to.include({
        isActive: true
      })
    })

  })

})
