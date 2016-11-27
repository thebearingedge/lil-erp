import Knex from 'knex'
import { before, after } from 'global'
import chai, { expect } from 'chai'
import { chaiStruct } from 'chai-struct'
import { development } from '../db'

const knex = new Knex(development)

const rejected = promise => promise.catch(err => err)

const begin = setup => done => {
  rejected(knex.transaction(trx => {
    setup(trx)
    done()
  }))
}

before(() => knex.seed.run())

after(() => knex.destroy())

chai.use(chaiStruct)

export {
  begin,
  expect,
  rejected
}
