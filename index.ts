export { default as LocalStorage } from './lib/storages/local_storage'
export { default as S3Storage } from './lib/storages/s3_storage'
export { default as Storage } from './lib/storages/storage'

export { bindStorage as bindSequelize } from './lib/binds/sequelize_bind'
