# abstorage

Abstract for storage

## WARNING
Under development.

## Usage

```js
const abstorage = require('abstrage')
const { ProviderS3, ProviderLocal } = abstorage.providers

abstorage.use(new ProviderLocal({dst: 'tmp'}))
abstorage.use(new ProviderS3({accessKeyId: '', secretAccessKey: ''}))

let storage = null
if (process.env.NODE_ENV === 'production') {
  storage = abstorage.storage('s3')
} else {
  storage = abstorage.storage('local')
}
```