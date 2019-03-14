import BaseProvider from '../base/provider'
import Storage from './storage'

class LocalProvider extends BaseProvider {
  _storage: Storage
  constructor({ dst }) {
    super()
    this._storage = new Storage({ dst })
  }

  get name() {
    return 'local'
  }

  get storage() {
    return this._storage
  }
}

export default LocalProvider
