const AWS = require('aws-sdk')
const BaseStorage = require('../base/storage')

class S3Storage extends BaseStorage {
  constructor (args) {
    super()
    const { bucket } = args
    this.bucket = bucket
    this.service = new AWS.S3(args)
  }

  put (key, body, options) {
    const param = Object.assign({}, { Bucket: this.bucket, Key: key, Body: body }, options)
    return this.service.putObject(param).promise()
  }

  async get (key, options) {
    const param = Object.assign({}, { Bucket: this.bucket, Key: key }, options)
    const res = await this.service.getObject(param).promise()
    return { data: res.Body }
  }
}

module.exports = S3Storage
