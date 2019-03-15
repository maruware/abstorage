# abstorage

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