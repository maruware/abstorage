# abstorage

[![CircleCI](https://circleci.com/gh/maruware/abstorage.svg?style=svg)](https://circleci.com/gh/maruware/abstorage)
[![Coverage Status](https://coveralls.io/repos/github/maruware/abstorage/badge.svg?branch=master)](https://coveralls.io/github/maruware/abstorage?branch=master)

Abstract for storage


## WARNING
Under development.

## Usage

```ts
const { S3Storage, LocalStorage } = from 'abstrage'

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