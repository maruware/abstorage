import path from 'path'
import fs from 'fs'
import util from 'util'
import mkdirp from 'mkdirp'
import BaseStorage from '../base/storage'

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

interface LocalStorageArgs {
  dst: string
}
class LocalStorage extends BaseStorage {
  private dst: string
  constructor(args: LocalStorageArgs) {
    super()
    this.dst = args.dst
  }

  put(key, body, options) {
    const filepath = this.objectPath(key)
    mkdirp.sync(path.dirname(filepath))
    return writeFile(filepath, body)
  }

  async get(key, options) {
    const data = await readFile(this.objectPath(key))
    return { data }
  }

  objectPath(key) {
    return path.resolve(this.dst, key)
  }
}

export default LocalStorage
