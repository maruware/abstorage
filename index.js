const Providers = require('./lib/providers')

let providers = {}

const use = (provider) => {
  providers[provider.name] = provider
}

const storage = (name) => {
  const provider = providers[name]
  if (!provider) {
    throw new Error(`provider[${name}] is undefined`)
  }
  return providers[name].storage
}

module.exports = { use, providers: Providers, storage }