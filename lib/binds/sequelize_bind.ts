import { Model } from 'sequelize'
import { Storage } from '../../index'
import { GetResponse } from '../storages/storage'

export interface StorageData {
  url: string
  fetchData(): Promise<GetResponse>
}

type ContentTypeResolver<ModelType extends Model> = (
  instance: ModelType
) => string
type ContentKeyResolver<ModelType extends Model> = (
  instance: ModelType
) => string

interface BindStorageArg<ModelType extends Model> {
  column: keyof ModelType
  storage: Storage
  contentType: string | ContentTypeResolver<ModelType>
  resolveKey: ContentKeyResolver<ModelType>
}

export const bindStorage = <ModelType extends Model>({
  column,
  storage,
  contentType,
  resolveKey
}: BindStorageArg<ModelType>) => {
  const getter = function(this: ModelType): StorageData {
    const storageKey = this.getDataValue(column) as unknown
    return {
      url: storage.resolveUrl(storageKey as string),
      fetchData: () => storage.get(storageKey as string)
    }
  }
  const job = new Map<ModelType, () => Promise<void>>()
  const setter = async function(this: ModelType, buf: Buffer) {
    job.set(this, async () => {
      const storageKey = resolveKey(this)
      await storage.put(storageKey, buf, { ContentType: contentType })
      this.setDataValue(column, storageKey as any)
      job.delete(this)
      await this.save()
    })
  }

  const hook = async (instance: ModelType) => {
    const fn = job.get(instance)
    if (fn) {
      await fn()
    }
  }
  return { getter, setter, hook }
}
