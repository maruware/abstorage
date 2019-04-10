/* eslint-env jest */
import AWS from 'aws-sdk-mock'

import { S3Storage, Storage } from '../index'
import { readFileSync, createReadStream } from 'fs'
import { join } from 'path'
import { Stream } from 'stream'

describe('S3Storage test', function() {
  beforeEach(() => {
    AWS.mock('S3', 'upload', (params: any, callback: any) => {
      callback(null, 'success')
    })
    AWS.mock('S3', 'getObject', 'success')
  })
  it('Put string data', async function() {
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

  it('Put binary buffer', async function() {
    const storage: Storage = new S3Storage({ bucket: 'my-bucket' })

    const key = 'test.png'
    const data = readFileSync(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)

    await storage.get(key)
  })

  it('Put binary stream', async function() {
    const storage: Storage = new S3Storage({ bucket: 'my-bucket' })

    const key = 'test.png'
    const data = createReadStream(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)

    await storage.get(key)
  })

  it('Get binary stream', async function() {
    const storage: Storage = new S3Storage({ bucket: 'my-bucket' })

    const key = 'from_stream.png'
    const data = createReadStream(join('test', 'data', 'sample.png'))
    const options = {}

    await storage.put(key, data, options)

    const res = await storage.get(key, { dataType: 'stream' })
    expect(res.data).toBeInstanceOf(Stream)
  })

  it('Set host', async function() {
    const storage: Storage = new S3Storage({
      bucket: 'my-bucket',
      host: 'http://my-site.example.com'
    })

    const key = 'test.txt'
    const data = 'Hello, world!'
    await storage.put(key, data)
    const url = storage.resolveUrl(key)
    expect(url).toBe('http://my-site.example.com/test.txt')
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
