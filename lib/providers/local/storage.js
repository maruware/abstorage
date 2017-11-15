const path = require('path')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

const BaseStorage = require('../base/storage')

class LocalStorage extends BaseStorage {
  constructor ({dst}) {
    super()
    this.dst = dst
  }

  put ({key, body}) {
    return writeFile(this.objectPath(key), body)
  }

  async get ({key}) {
    const data = await readFile(this.objectPath(key))
    return {data}
  }

  objectPath (key) {
    return path.resolve(this.dst, key)
  }
}

module.exports = LocalStorage
