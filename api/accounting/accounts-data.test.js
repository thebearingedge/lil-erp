import { describe, beforeEach, afterEach, it } from 'global'
import { begin, expect, rollback } from '../__test__'
import { structs } from './__fixtures__'
import accountsData from './accounts-data'

describe('accountsData', () => {

  let trx
  let accounts

  beforeEach(begin(_trx => {
    trx = _trx
    accounts = accountsData(trx)
  }))

  afterEach(() => rollback(trx))

  describe('create', () => {
    it('creates an account', async () => {
      const account = {
        code: '1001',
        name: 'Found on the Ground',
        description: 'Revenue from walking down the street.',
        parentCode: '1000'
      }
      const created = await accounts.create(account)
      expect(created).to.have.structure(structs.Account)
    })
  })

  describe('update', () => {
    it('updates an account', async () => {
      const updates = { name: 'COGS' }
      const updated = await accounts.update('5000', updates)
      expect(updated).to.have.structure(structs.Account)
    })
  })

  describe('find', () => {
    it('lists all accounts', async () => {
      const list = await accounts.find()
      expect(list).to.have.length.above(0)
      expect(list).to.have.structure([structs.Account])
    })
  })

  describe('makeInactive', () => {
    it('makes an account inactive by code', async () => {
      const inactive = await accounts.makeInactive('1000')
      expect(inactive).to.have.structure(structs.Account)
      expect(inactive).to.have.property('isActive', false)
    })
  })

})
