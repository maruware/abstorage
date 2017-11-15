class BaseStorage {
  constructor() {
  }

  put(arg) {
    throw new Error('Not implemented')
  }

  async get() {
    throw new Error('Not implemented')
  }
}

module.exports = BaseStorage
