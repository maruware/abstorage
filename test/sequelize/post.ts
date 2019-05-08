import { DataTypes, Model } from 'sequelize'
import { sequelize } from './connection'
import { storage } from './storage'

import { bindStorage } from '../../lib/binds/sequelize_bind'

const { getter, setter, onSaveHook, onDestroyHook } = bindStorage<Post>({
  column: 'imageKey',
  storage,
  contentType: 'image/png',
  resolveKey: post => `posts/image/${post.id}_${Date.now()}.png`
})

export class Post extends Model {
  public id: number
  public imageKey: string
  public createdAt: Date
  public updatedAt: Date
  public image: any

  public getImage = getter
}

Post.init(
  {
    imageKey: DataTypes.STRING
  },
  {
    setterMethods: {
      image: setter
    },
    sequelize
  }
)

Post.afterUpdate(onSaveHook)
Post.afterCreate(onSaveHook)
Post.afterDestroy(onDestroyHook)
