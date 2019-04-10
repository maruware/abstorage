import { DataTypes, Model } from 'sequelize'
import { sequelize } from './connection'
import { storage } from './storage'

import { bindStorage } from '../../lib/binds/sequelize_bind'

export class Post extends Model {
  public id: number
  public imageKey: string
  public createdAt: Date
  public updatedAt: Date
  public image: any
}

const { getter, setter, onSaveHook, onDestroyHook } = bindStorage<Post>({
  column: 'imageKey',
  storage,
  contentType: 'image/png',
  resolveKey: post => `posts/image/${post.id}_${Date.now()}.png`
})

Post.init(
  {
    imageKey: DataTypes.STRING
  },
  {
    getterMethods: {
      image: getter
    },
    setterMethods: {
      image: setter
    },
    sequelize
  }
)

Post.afterUpdate(onSaveHook)
Post.afterCreate(onSaveHook)
Post.afterDestroy(onDestroyHook)
