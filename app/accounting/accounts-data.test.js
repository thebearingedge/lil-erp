import { describe, beforeEach, afterEach, context, it } from 'global'
import { begin, expect } from '../__test__'
import { structs } from './__fixtures__'
import accountsData from './accounts-data'

describe('testing', () => {

  let trx
  let accounts

  beforeEach(begin(_trx => {
    trx = _trx
    accounts = accountsData(trx)
  }))

  afterEach(() => trx.rollback())

  describe('findByCode', () => {
    context('when the account exists', () => {
      it('returns the account', async () => {
        const account = await accounts.findByCode('1000')
        expect(account).to.have.structure(structs.Account)
      })
    })
  })

})
