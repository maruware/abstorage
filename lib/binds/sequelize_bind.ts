import { Model } from 'sequelize'
import { Storage } from '../../index'
import { Body, GetDataTypeOption } from '../storages/storage'

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
  preprocess?: (data: Body) => Promise<Body>
}

export const bindStorage = <ModelType extends Model>({
  column,
  storage,
  contentType,
  resolveKey,
  preprocess
}: BindStorageArg<ModelType>) => {
  const getter = function(this: ModelType) {
    const storageKey = this.getDataValue(column) as unknown
    return {
      url: storage.resolveUrl(storageKey as string),
      fetchData: (options?: GetDataTypeOption<'buffer' | 'stream'>) =>
        storage.get(storageKey as string, options)
    }
  }
  const job = new Map<ModelType, () => Promise<void>>()
  const setter = function(this: ModelType, orgData: Body) {
    this.setDataValue(column, `_tmp_val_${Date.now()}` as any)
    job.set(this, async () => {
      let data = preprocess ? await preprocess(orgData) : orgData
      const storageKey = resolveKey(this)
      await storage.put(storageKey, data, { ContentType: contentType })
      this.setDataValue(column, storageKey as any)
      job.delete(this)
      await this.save()
    })
  }

  const onSaveHook = async (instance: ModelType) => {
    const fn = job.get(instance)
    if (fn) {
      await fn()
    }
  }
  const onDestroyHook = async (instance: ModelType) => {
    const storageKey = instance.getDataValue(column) as unknown
    await storage.delete(storageKey as string)
  }
  return { getter, setter, onSaveHook, onDestroyHook }
}
