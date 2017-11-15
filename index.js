const Providers = require('./lib/providers')

let providers = {}

const use = (provider) => {
  providers[provider.name] = provider
}

const storage = (name) => {
  return providers[name].storage
}

module.exports = { use, providers: Providers, storage }