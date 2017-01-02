import Knex from 'knex'
import { after } from 'global'
import chai, { expect } from 'chai'
import { chaiStruct } from 'chai-struct'
import { development } from '../db'

const knex = new Knex(development)

const rejected = promise => promise.catch(_ => _)

const begin = setup => done => {
  rejected(knex.transaction(trx => {
    setup(trx)
    done()
  }))
}

const rollback = trx => trx.rollback()

after(() => knex.destroy())

chai.use(chaiStruct)

export {
  begin,
  expect,
  rollback,
  rejected
}
