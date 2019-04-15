# abstorage

[![CircleCI](https://circleci.com/gh/maruware/abstorage.svg?style=svg)](https://circleci.com/gh/maruware/abstorage)
[![Coverage Status](https://coveralls.io/repos/github/maruware/abstorage/badge.svg?branch=master)](https://coveralls.io/github/maruware/abstorage?branch=master)
[![npm version](https://badge.fury.io/js/abstorage.svg)](https://badge.fury.io/js/abstorage)

Abstract storage (S3, Local)

Inspired by [carrierwave](https://github.com/carrierwaveuploader/carrierwave) and [fog](https://github.com/fog).


## Usage

```ts
const { S3Storage, LocalStorage } = from 'abstorage'

let storage: Storage = null
if (process.env.NODE_ENV === 'production') {
  storage = new S3Storage({bucket: 'some-bucket'})
} else {
  storage = new LocalStorage({dst: 'tmp'}))
}

const key = 'awesome/object.jpg'
const data = fs.readFileSync(path.resolve('awesome', 'object.jpg'))
storage.put(key, data, {ContentType: 'image/jpeg'})
storage.get(key)
```

#### Sequelize bind

```ts
import { DataTypes, Model } from 'sequelize'
import { sequelize } from './connection'
import { storage } from './storage'

import { bindStorage } from 'abstorage'
import { Stream, PassThrough } from 'stream'
import sharp from 'sharp'

export class User extends Model {
  public id: number
  public name: string
  public iconKey: string
  public createdAt: Date
  public updatedAt: Date
  public icon: any
}

const { getter, setter, onSaveHook, onDestroyHook } = bindStorage<User>({
  column: 'iconKey',
  storage,
  contentType: 'image/jpeg',
  resolveKey: user => `users/icon/${user.id}.jpg`,
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

User.afterUpdate(onSaveHook)
User.afterCreate(onSaveHook)
User.afterDestroy(onDestroyHook)
```