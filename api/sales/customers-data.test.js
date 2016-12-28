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

  describe('create', () => {
    it('creates a customer', async () => {
      const customer = {
        name: 'Denis Mgulumbwa',
        notes: 'Hello... my name is Denis'
      }
      const created = await customers.create(customer)
      expect(created).to.have.structure(structs.Customer)
      expect(created).to.include({
        openBalance: 0,
        isActive: true
      })
    })
  })

})
