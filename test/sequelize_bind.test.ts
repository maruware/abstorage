/* eslint-env mocha */

import { assert } from 'chai'
import { User } from './sequelize/user'
import { sequelize } from './sequelize/connection'
import { readFileSync, statSync, createReadStream } from 'fs'
import path from 'path'
import { storage } from './sequelize/storage'
import { Stream } from 'stream'
import sharp from 'sharp'
import { Post } from './sequelize/post'

describe('Bind Sequelize test', function() {
  beforeEach(async () => {
    await sequelize.sync()
    await User.truncate()
  })

  it('no preprocess', async function() {
    const image = readFileSync(path.join('test', 'data', 'sample.png'))

    let post = new Post({ image })
    await post.save()
    let findedPost = await Post.findOne()
    assert.equal(findedPost.id, post.id)

    statSync(storage.objectPath(post.imageKey))
    let { data } = await post.image.fetchData()

    assert.equal(data.toString('base64'), image.toString('base64'))
  })

  it('preprocess', async function() {
    const name = 'takashi'
    const icon = readFileSync(path.join('test', 'data', 'user.jpg'))

    let meta = await sharp(icon).metadata()
    assert.notEqual(meta.width, 100)

    let user = new User({ name, icon })
    await user.save()
    let findedUser = await User.findOne()
    assert.equal(user.id, findedUser.id)
    assert.equal(user.name, name)

    statSync(storage.objectPath(user.iconKey))
    let { data } = await user.icon.fetchData()

    // exist and resized
    meta = await sharp(data).metadata()
    assert.equal(meta.width, 100)
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

  it('update data', async function() {
    const name = 'takashi'
    let icon = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user1 = new User({ name, icon })
    await user1.save()

    const iconUrl1 = user1.icon.url
    statSync(storage.objectPath(user1.iconKey))

    icon = createReadStream(path.join('test', 'data', 'sample.png'))
    await user1.update({ icon })
    const iconUrl2 = user1.icon.url
    assert.notEqual(iconUrl2, iconUrl1)

    const user2 = await User.findOne({ where: { id: user1.id } })

    assert.equal(user2.icon.url, iconUrl2)
  })
})
