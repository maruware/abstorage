import AWS from 'aws-sdk'
import BaseStorage from '../base/storage'

interface S3StorageArgs extends AWS.S3.ClientConfiguration {
  bucket: string
}
class S3Storage extends BaseStorage {
  private bucket: string
  private service: AWS.S3
  constructor(args: S3StorageArgs) {
    super()
    const { bucket } = args
    this.bucket = bucket
    this.service = new AWS.S3(args)
  }

  put(key, body, options) {
    const param = Object.assign(
      {},
      { Bucket: this.bucket, Key: key, Body: body },
      options
    )
    return this.service.putObject(param).promise()
  }

  async get(key, options) {
    const param = Object.assign({}, { Bucket: this.bucket, Key: key }, options)
    const res = await this.service.getObject(param).promise()
    return { data: res.Body }
  }
}

export default S3Storage
