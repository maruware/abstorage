import { S3Provider, LocalProvider } from './lib/providers'

export const use = provider => {
  providers[provider.name] = provider
}

export const storage = name => {
  const provider = providers[name]
  if (!provider) {
    throw new Error(`provider[${name}] is undefined`)
  }
  return providers[name].storage
}

export const providers = { S3Provider, LocalProvider }
