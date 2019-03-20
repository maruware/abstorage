import path from 'path'
import fs, { createWriteStream, createReadStream } from 'fs'
import util from 'util'
import mkdirp from 'mkdirp'
import BaseStorage, { Body, GetDataTypeOption, GetReturn } from './storage'
import { Stream } from 'stream'

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

export interface LocalStorageArgs {
  dst: string
  host?: string
}
class LocalStorage extends BaseStorage {
  private dst: string
  private host: string
  constructor(args: LocalStorageArgs) {
    super()
    this.dst = args.dst
    this.host = args.host
  }

  put(key: string, body: Body, options?: any) {
    const filepath = this.objectPath(key)
    mkdirp.sync(path.dirname(filepath))
    if (body instanceof Stream) {
      const dst = createWriteStream(filepath)
      body.pipe(dst)
      return Promise.resolve()
    }
    return writeFile(filepath, body)
  }
  async get(
    key: string,
    options?: GetDataTypeOption<'buffer'>
  ): Promise<GetReturn<Buffer>>
  async get(
    key: string,
    options?: GetDataTypeOption<'stream'>
  ): Promise<GetReturn<Stream>>
  async get(
    key: string,
    options: GetDataTypeOption<any> = { dataType: 'buffer' }
  ): Promise<GetReturn<any>> {
    const filePath = this.objectPath(key)
    if (options.dataType === 'buffer') {
      const data = await readFile(filePath)
      return { data }
    } else {
      return { data: createReadStream(filePath) }
    }
  }

  resolveUrl(key: string) {
    if (this.host) {
      return `${this.host}/${key}`
    } else {
      return `/${key}`
    }
  }

  objectPath(key: string) {
    return path.resolve(this.dst, key)
  }
}

export default LocalStorage
