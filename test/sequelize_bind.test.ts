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
    const imageFile = readFileSync(path.join('test', 'data', 'sample.png'))

    let post = new Post({ image: imageFile })
    await post.save()
    let findedPost = await Post.findOne()
    expect(findedPost.id).toBe(post.id)

    statSync(storage.objectPath(post.imageKey))
    let image = await post.getImage()
    let { data } = await image.fetchData()

    expect(data.toString('base64')).toBe(imageFile.toString('base64'))
  })

  it('preprocess', async function() {
    const name = 'takashi'
    const iconFile = readFileSync(path.join('test', 'data', 'user.jpg'))

    let meta = await sharp(iconFile).metadata()
    expect(meta.width).not.toBe(100)

    let user = new User({ name, icon: iconFile })
    await user.save()
    let findedUser = await User.findOne()
    expect(user.id).toBe(findedUser.id)
    expect(user.name).toBe(name)

    statSync(storage.objectPath(user.iconKey))
    let icon = await user.getIcon()
    let { data } = await icon.fetchData()

    // exist and resized
    meta = await sharp(data).metadata()
    expect(meta.width).toBe(100)
  })

  it('stream inout', async function() {
    const name = 'takashi'
    const iconFile = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user = new User({ name, icon: iconFile })
    await user.save()

    statSync(storage.objectPath(user.iconKey))

    let icon = await user.getIcon()
    let { data } = await icon.fetchData({ dataType: 'stream' })

    expect(data).toBeInstanceOf(Stream)
  })

  it('update data', async function() {
    const name = 'takashi'
    let iconFile = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user1 = new User({ name, icon: iconFile })
    await user1.save()
    const iconUrl1 = (await user1.getIcon()).url
    statSync(storage.objectPath(user1.iconKey))

    iconFile = createReadStream(path.join('test', 'data', 'sample.png'))
    await user1.update({ icon: iconFile })

    const iconUrl2 = (await user1.getIcon()).url
    expect(iconUrl2).not.toBe(iconUrl1)

    const user2 = await User.findOne({ where: { id: user1.id } })

    expect((await user2.getIcon()).url).toBe(iconUrl2)
  })

  it('destroy', async function() {
    const name = 'takashi'
    const iconFile = createReadStream(path.join('test', 'data', 'user.jpg'))
    let user = new User({ name, icon: iconFile })
    await user.save()

    statSync(storage.objectPath(user.iconKey))
    await user.destroy()

    const s = () => {
      statSync(storage.objectPath(user.iconKey))
    }
    expect(s).toThrow()
  })
})
