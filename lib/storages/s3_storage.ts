import { S3 } from 'aws-sdk'
import { Omit } from 'type-fest'
import BaseStorage, { Body } from './storage'

export interface S3StorageArgs extends S3.ClientConfiguration {
  bucket: string
  host?: string
}

class S3Storage extends BaseStorage {
  private bucket: string
  private host: string
  private service: S3
  constructor(args: S3StorageArgs) {
    super()
    const { bucket, host, ...rest } = args
    this.bucket = bucket
    this.host = host
    this.service = new S3(rest)
  }

  put(
    key: string,
    body: Body,
    options: Omit<S3.Types.PutObjectRequest, 'Bucket' | 'Key' | 'Body'>
  ) {
    const param = {
      ...options,
      Bucket: this.bucket,
      Key: key,
      Body: body
    }
    return this.service.putObject(param).promise()
  }

  async get(key: string, options: Omit<S3.GetObjectRequest, 'Bucket' | 'Key'>) {
    const param = { ...options, Bucket: this.bucket, Key: key }
    const res = await this.service.getObject(param).promise()
    return { data: res.Body }
  }

  resolveUrl(key: string): string {
    if (this.host) {
      return `${this.host}/${key}`
    } else {
      return this.service.getSignedUrl('getObject', {
        Bucket: this.bucket,
        Key: key
      })
    }
  }
}

export default S3Storage
