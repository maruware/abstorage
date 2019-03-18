import { DataTypes, Model } from 'sequelize'
import { sequelize } from './connection'
import { storage } from './storage'

import { bindStorage, StorageData } from '../../lib/binds/sequelize_bind'

export class User extends Model {
  public id: number
  public name: string
  public iconKey: string
  public createdAt: Date
  public updatedAt: Date
  public icon: any
}

const { getter, setter, hook } = bindStorage<User>({
  column: 'iconKey',
  storage,
  contentType: 'image/jpeg',
  resolveKey: user => `users/icon/${user.id}.jpg`
})

User.init(
  {
    name: DataTypes.STRING,
    iconKey: DataTypes.STRING
  },
  {
    getterMethods: {
      icon: getter
    },
    setterMethods: {
      icon: setter
    },
    sequelize
  }
)

User.afterUpdate(hook)
User.afterCreate(hook)
