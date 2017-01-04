import { describe, beforeEach, afterEach, context, it } from 'global'
import { begin, expect, rollback, rejected } from './__test__'
import { Account } from './__fixtures__'
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

    it('inserts an "accounts" row', async () => {
      await accounts.create(account)
      const accountsRow = await trx
        .select('*')
        .from('accounts')
        .where('name', account.name)
        .first()
      expect(accountsRow).to.exist
    })

    it('returns the created account', async () => {
      const created = await accounts.create(account)
      expect(created).to.exist
    })

    it('returns the account with the correct structure', async () => {
      const created = await accounts.create(account)
      expect(created).to.have.structure(Account)
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
        .that.includes('accounts_name')
    })

    it('creates an account with default properties', async () => {
      const created = await accounts.create(account)
      expect(created).to.include({
        ...account,
        parentCode: null,
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
          ...account,
          parentCode: parentAccount.code,
          type: parentAccount.type,
          class: parentAccount.class,
          isActive: true,
          isSystemAccount: false
        })
      })

    })

  })

})
