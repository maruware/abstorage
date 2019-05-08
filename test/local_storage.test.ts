/* eslint-env jest */

import { LocalStorage, Storage } from '../index'
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
    expect(res.data.toString()).toBe(data)
  })

  it('Put binary buffer', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'from_buffer.png'
    const data = readFileSync(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)
    const res = await storage.get(key)
    expect(res.data.toString('base64')).toBe(data.toString('base64'))
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
    expect(res.data).toBeInstanceOf(Stream)
  })

  it('Set host', async function() {
    const storage: Storage = new LocalStorage({
      dst: '/tmp',
      host: 'http://localhost:8080'
    })

    const key = 'test.txt'
    const data = 'Hello, world!'
    await storage.put(key, data)
    const url = await storage.resolveUrl(key)
    expect(url).toBe('http://localhost:8080/test.txt')
  })
})
