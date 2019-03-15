/* eslint-env mocha */
import AWS from 'aws-sdk-mock'

import { S3Storage, Storage } from '../index'
import { assert } from 'chai'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('S3Storage test', function() {
  beforeEach(() => {
    AWS.mock('S3', 'putObject', (params: any, callback: any) => {
      callback(null, 'success')
    })
    AWS.mock('S3', 'getObject', 'success')
  })
  it('String data', async function() {
    const storage: Storage = new S3Storage({
      bucket: 'my-bucket',
      region: 'ap-northeast-1'
    })

    const key = 'test.txt'
    const data = 'Hello, world!'
    const options = {}

    await storage.put(key, data, options)
    await storage.get(key)
  })

  it('Binary data', async function() {
    const storage: Storage = new S3Storage({ bucket: 'my-bucket' })

    const key = 'test.txt'
    const data = readFileSync(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)

    await storage.get(key)
  })

  it('set host', async function() {
    const storage: Storage = new S3Storage({
      bucket: 'my-bucket',
      host: 'http://my-site.example.com'
    })

    const key = 'test.txt'
    const data = 'Hello, world!'
    await storage.put(key, data)
    const url = storage.resolveUrl(key)
    assert.equal(url, 'http://my-site.example.com/test.txt')
  })

  it('resolve s3 default url', async function() {
    const mockUrl = 'http://s3.example.com'
    AWS.mock('S3', 'getSignedUrl', mockUrl)

    const storage: Storage = new S3Storage({
      bucket: 'my-bucket'
    })

    const key = 'test.txt'
    const data = 'Hello, world!'
    await storage.put(key, data)
    const url = storage.resolveUrl(key)
    // assert.equal(url, mockUrl)
  })
})
