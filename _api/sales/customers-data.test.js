import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
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
      expect(created).to.have.structure(structs.Customer)
    })

    it('creates a customer with default properties', async () => {
      const created = await customers.create(customer)
      expect(created).to.include({
        openBalance: 0,
        isActive: true
      })
    })

  })

  describe('findById', () => {
    it('finds a customer by id', async () => {
      const { id } = await trx
        .select('id')
        .from('customers')
        .first()
      const customer = await customers.findById(id)
      expect(customer).to.have.structure(structs.Customer)
    })
  })

})
