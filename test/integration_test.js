const abstorage = require('../')
const {assert} = require('chai')

describe('IntegrationTest', function () {
  it('Simple usage', async function () {
    const { LocalProvider } = abstorage.providers

    abstorage.use(new LocalProvider({ dst: '/tmp' }))
    const storage = abstorage.storage('local')

    const key = 'test.txt'
    const data = 'Hello, world!'

    await storage.put(key, data)
    const res = await storage.get(key)
    assert.equal(res.data, data)
  })
})
