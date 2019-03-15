import path from 'path'
import fs from 'fs'
import util from 'util'
import mkdirp from 'mkdirp'
import BaseStorage, { Body } from '../base/storage'

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

export interface LocalStorageArgs {
  dst: string
}
class LocalStorage extends BaseStorage {
  private dst: string
  constructor(args: LocalStorageArgs) {
    super()
    this.dst = args.dst
  }

  put(key: string, body: Body, options?: any) {
    const filepath = this.objectPath(key)
    mkdirp.sync(path.dirname(filepath))
    return writeFile(filepath, body)
  }

  async get(key: string, options?: any) {
    const data = await readFile(this.objectPath(key))
    return { data }
  }

  objectPath(key: string) {
    return path.resolve(this.dst, key)
  }
}

export default LocalStorage
