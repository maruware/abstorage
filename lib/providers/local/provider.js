'use strict'

const path = require('path')

const BaseProvider = require('../base/provider')
const Storage = require('./storage')

class LocalProvider extends BaseProvider {
  constructor({dst}) {
    super()
    this._storage = new Storage({dst})
  }

  get name () {
    return 'local'
  }

  get storage () {
    return this._storage
  }
}

module.exports = LocalProvider
