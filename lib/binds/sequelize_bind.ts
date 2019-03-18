import { Model } from 'sequelize'
import { Storage } from '../../index'
import { GetResponse } from '../storages/storage';

export interface StorageData {
  url: string
  fetchData(): Promise<GetResponse>
}

export const bindStorage = <ModelType extends Model>(
  column: keyof ModelType,
  storage: Storage,
  resolveKey: (instance: ModelType) => string
) => {
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
      await storage.put(storageKey, buf, { ContentType: 'image/jpeg' })
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
