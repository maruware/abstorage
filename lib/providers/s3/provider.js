const path = require('path')

const BaseProvider = require('../base/provider')
const Storage = require('./storage')

class S3Provider extends BaseProvider {
  constructor(options) {
    super()
    this._storage = new Storage(options)
  }

  get name() {
    return 's3'
  }

  get storage() {
    return this._storage
  }
}

module.exports = S3Provider
