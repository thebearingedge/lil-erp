import Knex from 'knex'
import { before, after } from 'global'
import chai, { expect } from 'chai'
import { chaiStruct } from 'chai-struct'
import { development } from '../db'

const knex = new Knex(development)

const suppress = promise => promise.catch(_ => _)

const begin = setup => done => {
  suppress(knex.transaction(trx => {
    setup(trx)
    done()
  }))
}

const rollback = trx => trx.rollback()

before(() => knex.seed.run())

after(() => knex.destroy())

chai.use(chaiStruct)

export {
  begin,
  expect,
  rollback
}
