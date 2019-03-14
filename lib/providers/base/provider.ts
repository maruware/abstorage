import BaseStorage from './storage'

abstract class BaseProvider {
  get name(): string {
    throw new Error('Not Implemented')
  }

  get storage(): BaseStorage {
    throw new Error('Not Implemented')
  }
}

export default BaseProvider
