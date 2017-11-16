'use strict'

class BaseProvider {
  get name () {
    throw new Error('Not Implemented')
  }

  get storage () {
    throw new Error('Not Implemented')
  }
}

module.exports = BaseProvider
