/* eslint-env mocha */

import { LocalStorage, Storage } from '../index'
import { assert } from 'chai'
import { readFileSync, createReadStream } from 'fs'
import { join } from 'path'
import { Stream } from 'stream'

describe('LocalStorage test', function() {
  it('Put string data', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'test.txt'
    const data = 'Hello, world!'
    const options = {}

    await storage.put(key, data, options)
    const res = await storage.get(key)
    assert.equal(res.data.toString(), data)
  })

  it('Put binary buffer', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'from_buffer.png'
    const data = readFileSync(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)
    const res = await storage.get(key)
    assert.equal(res.data.toString('base64'), data.toString('base64'))
  })

  it('Put binary stream', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'from_stream.png'
    const data = createReadStream(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)

    await storage.get(key)
  })

  it('Get binary stream', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'from_stream.png'
    const data = createReadStream(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)

    const res = await storage.get(key, { dataType: 'stream' })
    assert.isTrue(res.data instanceof Stream)
  })

  it('Set host', async function() {
    const storage: Storage = new LocalStorage({
      dst: '/tmp',
      host: 'http://localhost:8080'
    })

    const key = 'test.txt'
    const data = 'Hello, world!'
    await storage.put(key, data)
    const url = storage.resolveUrl(key)
    assert.equal(url, 'http://localhost:8080/test.txt')
  })
})
