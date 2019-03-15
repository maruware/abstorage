/* eslint-env mocha */

import { LocalStorage, Storage } from '../index'
import { assert } from 'chai'

describe('IntegrationTest', function() {
  it('Simple usage', async function() {
    const storage: Storage = new LocalStorage({ dst: '/tmp' })

    const key = 'test.txt'
    const data = 'Hello, world!'
    const options = {}

    await storage.put(key, data, options)
    const res = await storage.get(key)
    assert.equal(res.data.toString(), data)
  })
})
