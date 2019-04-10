/* eslint-env jest */

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
    expect(findedPost.id).toBe(post.id)

    statSync(storage.objectPath(post.imageKey))
    let { data } = await post.image.fetchData()

    expect(data.toString('base64')).toBe(image.toString('base64'))
  })

  it('preprocess', async function() {
    const name = 'takashi'
    const icon = readFileSync(path.join('test', 'data', 'user.jpg'))

    let meta = await sharp(icon).metadata()
    expect(meta.width).not.toBe(100)

    let user = new User({ name, icon })
    await user.save()
    let findedUser = await User.findOne()
    expect(user.id).toBe(findedUser.id)
    expect(user.name).toBe(name)

    statSync(storage.objectPath(user.iconKey))
    let { data } = await user.icon.fetchData()

    // exist and resized
    meta = await sharp(data).metadata()
    expect(meta.width).toBe(100)
  })

  it('stream inout', async function() {
    const name = 'takashi'
    const icon = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user = new User({ name, icon })
    await user.save()

    statSync(storage.objectPath(user.iconKey))

    let { data } = await user.icon.fetchData({ dataType: 'stream' })
    expect(data).toBeInstanceOf(Stream)
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
    expect(iconUrl2).not.toBe(iconUrl1)

    const user2 = await User.findOne({ where: { id: user1.id } })

    expect(user2.icon.url).toBe(iconUrl2)
  })

  it('destroy', async function() {
    const name = 'takashi'
    const icon = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user = new User({ name, icon })
    await user.save()

    statSync(storage.objectPath(user.iconKey))
    await user.destroy()

    const s = () => {
      statSync(storage.objectPath(user.iconKey))
    }
    expect(s).toThrow()
  })
})
