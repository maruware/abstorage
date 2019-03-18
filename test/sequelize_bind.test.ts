/* eslint-env mocha */

import { assert } from 'chai'
import { User } from './sequelize/user'
import { sequelize } from './sequelize/connection'
import { readFileSync, statSync } from 'fs'
import path from 'path'
import { storage } from './sequelize/storage'

describe('Bind Sequelize test', function() {
  beforeEach(async () => {
    await sequelize.sync()
  })
  it('sequelize works', async function() {
    const name = 'takashi'
    const icon = readFileSync(path.join('test', 'data', 'user.jpg'))
    let user = await User.create({ name, icon })
    let findedUser = await User.findOne()
    assert.equal(user.id, findedUser.id)
    assert.equal(user.name, name)

    statSync(storage.objectPath(user.iconKey))
  })
})
