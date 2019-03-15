/* eslint-env mocha */

import { LocalStorage, Storage } from '../index'
import { assert } from 'chai'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('LocalStorage test', function() {
  it('String data', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'test.txt'
    const data = 'Hello, world!'
    const options = {}

    await storage.put(key, data, options)
    const res = await storage.get(key)
    assert.equal(res.data.toString(), data)
  })

  it('Binary data', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'test.txt'
    const data = readFileSync(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)
    const res = await storage.get(key)
    assert.equal(res.data.toString(), data)
  })

  it('set host', async function() {
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
