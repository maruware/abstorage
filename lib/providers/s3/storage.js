const AWS = require('aws-sdk')
const BaseStorage = require('../base/storage')

class S3Storage extends BaseStorage {
  constructor(args) {
    super()
    const { bucket } = args
    this.bucket = bucket
    this.service = new AWS.S3(args)
  }

  put(args) {
    const { key, body } = args
    delete params.key
    delete params.body
    const param = Object.assign({}, { Bucket: bucket, Key: key, Body: body }, args)
    return this.service.putObject(param).promise()
  }

  async get(args) {
    const { key } = args
    delete args.key
    const param = Object.assign({}, { Bucket: bucket, Key: key }, args)
    const res = await this.service.getObject(param).promise()
    return { data: res.Body }
  }
}

module.exports = S3Storage
