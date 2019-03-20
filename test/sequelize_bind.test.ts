/* eslint-env mocha */

import { assert } from 'chai'
import { User } from './sequelize/user'
import { sequelize } from './sequelize/connection'
import { readFileSync, statSync, createReadStream } from 'fs'
import path from 'path'
import { storage } from './sequelize/storage'
import { Stream } from 'stream'

describe('Bind Sequelize test', function() {
  beforeEach(async () => {
    await sequelize.sync()
    await User.truncate()
  })
  it('sequelize works', async function() {
    const name = 'takashi'
    const icon = readFileSync(path.join('test', 'data', 'user.jpg'))
    let user = new User({ name, icon })
    await user.save()
    let findedUser = await User.findOne()
    assert.equal(user.id, findedUser.id)
    assert.equal(user.name, name)

    statSync(storage.objectPath(user.iconKey))
    let { data } = await user.icon.fetchData()
    assert.equal(data.toString('base64'), icon.toString('base64'))
  })

  it('stream inout', async function() {
    const name = 'takashi'
    const icon = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user = new User({ name, icon })
    await user.save()

    statSync(storage.objectPath(user.iconKey))

    let { data } = await user.icon.fetchData({ dataType: 'stream' })
    assert.isTrue(data instanceof Stream)
  })
})
