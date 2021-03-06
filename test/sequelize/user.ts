import { DataTypes, Model } from 'sequelize'
import { sequelize } from './connection'
import { storage } from './storage'

import { bindStorage } from '../../lib/binds/sequelize_bind'
import { Stream, PassThrough } from 'stream'
import sharp from 'sharp'

const { getter, setter, onSaveHook, onDestroyHook } = bindStorage<User>({
  column: 'iconKey',
  storage,
  contentType: 'image/jpeg',
  resolveKey: user => `users/icon/${user.id}_${Date.now()}.jpg`,
  preprocess: async data => {
    const pipeline = sharp()
      .resize(100, 100)
      .jpeg({ quality: 80 })
    if (data instanceof Stream) {
      return data.pipe(pipeline)
    } else if (data instanceof Buffer) {
      const ret = new PassThrough()
      sharp(data)
        .pipe(pipeline)
        .pipe(ret)
      return ret
    } else {
      throw new Error('Bad data type')
    }
  }
})

export class User extends Model {
  public id: number
  public name: string
  public iconKey: string
  public createdAt: Date
  public updatedAt: Date
  public icon: any

  public getIcon = getter
}

User.init(
  {
    name: DataTypes.STRING,
    iconKey: DataTypes.STRING
  },
  {
    setterMethods: {
      icon: setter
    },
    sequelize
  }
)

User.afterUpdate(onSaveHook)
User.afterCreate(onSaveHook)
User.afterDestroy(onDestroyHook)
