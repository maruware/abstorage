# abstorage

Abstract for storage

## WARNING
Under development.

## Usage

```js
const abstorage = require('abstrage')
const { S3Provider, LocalProvider } = abstorage.providers

abstorage.use(new LocalProvider({dst: 'tmp'}))
abstorage.use(new S3Provider({accessKeyId: '', secretAccessKey: ''}))

let storage = null
if (process.env.NODE_ENV === 'production') {
  storage = abstorage.storage('s3')
} else {
  storage = abstorage.storage('local')
}
```