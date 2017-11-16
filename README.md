# abstorage

Abstract for storage

## WARNING
Under development.

## Usage

```js
const abstorage = require('abstrage')
const { S3Provider, LocalProvider } = abstorage.providers

// Local
abstorage.use(new LocalProvider({dst: 'tmp'}))

// use Environment vars or IAM
abstorage.use(new S3Provider({bucket: 'some-bucket'))
// specify property
abstorage.use(new S3Provider({bucket: 'some-bucket', accessKeyId: 'your_key', secretAccessKey: 'your_secret'}))

let storage = null
if (process.env.NODE_ENV === 'production') {
  storage = abstorage.storage('s3')
} else {
  storage = abstorage.storage('local')
}

const key = 'awesome/object.jpg'
const data = fs.readFileSync(path.resolve('awesome', 'object.jpg'))
storage.put(key, data, {ContentType: 'image/jpeg'})
storage.get(key)
```