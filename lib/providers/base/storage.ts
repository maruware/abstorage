abstract class BaseStorage {
  put(key, body, options) {
    throw new Error('Not implemented')
  }

  get(key, options) {
    throw new Error('Not implemented')
  }
}

export default BaseStorage