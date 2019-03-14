import BaseProvider from '../base/provider'
import Storage from './storage'

class S3Provider extends BaseProvider {
  private _storage: Storage
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

export default S3Provider
