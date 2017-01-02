import { describe, beforeEach, afterEach, context, it } from 'global'
import { begin, expect, rollback, rejected } from '../__test__'
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

    const account = {
      code: '0000',
      name: 'Tip Jar',
      description: 'Extended 401k.'
    }

    it('inserts an "accounts" record', async () => {
      await accounts.create(account)
      const record = await trx
        .select('*')
        .from('accounts')
        .where('name', account.name)
        .first()
      expect(record).to.exist
    })

    it('returns the created account', async () => {
      const created = await accounts.create(account)
      expect(created).to.exist
    })

    it('returns the account with the correct structure', async () => {
      const created = await accounts.create(account)
      expect(created).to.have.structure(structs.Account)
    })

    it('does not create accounts with the same code', async () => {
      await accounts.create(account)
      const otherAccount = {
        ...account,
        name: 'Tip Jar 2'
      }
      const err = await rejected(accounts.create(otherAccount))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('accounts_pkey')
    })

    it('does not create accounts with the same name', async () => {
      await accounts.create(account)
      const otherAccount = {
        ...account,
        code: '0001'
      }
      const err = await rejected(accounts.create(otherAccount))
      expect(err)
        .to.be.an('error')
        .with.property('message')
        .that.includes('accounts_name_unique')
    })

    it('creates an account with default properties', async () => {
      const created = await accounts.create(account)
      expect(created).to.include({
        parentCode: null,
        balance: 0,
        type: null,
        class: null,
        isActive: true,
        isSystemAccount: false
      })
    })

    context('when the account includes a parentCode', () => {

      let parentAccount

      beforeEach(async () => {
        parentAccount = await trx
          .select('*')
          .from('accounts')
          .where('type', 'cash')
          .first()
        expect(parentAccount).to.include.keys(['code', 'type', 'class'])
      })

      it('creates an account with inherited properties', async () => {
        const childAccount = {
          ...account,
          parentCode: parentAccount.code,
        }
        const created = await accounts.create(childAccount)
        expect(created).to.include({
          parentCode: parentAccount.code,
          type: parentAccount.type,
          class: parentAccount.class,
          isActive: true,
          isSystemAccount: false
        })
      })

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
