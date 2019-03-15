import AWS from 'aws-sdk'
import { Omit } from 'type-fest'
import BaseStorage, { Body } from '../base/storage'

export interface S3StorageArgs extends AWS.S3.ClientConfiguration {
  bucket: string
}
class S3Storage extends BaseStorage {
  private bucket: string
  private service: AWS.S3
  constructor(args: S3StorageArgs) {
    super()
    const { bucket } = args
    this.bucket = bucket
    this.service = new AWS.S3(args)
  }

  put(
    key: string,
    body: Body,
    options: Omit<AWS.S3.Types.PutObjectRequest, 'Bucket' | 'Key' | 'Body'>
  ) {
    const param = {
      ...options,
      Bucket: this.bucket,
      Key: key,
      Body: body
    }
    return this.service.putObject(param).promise()
  }

  async get(
    key: string,
    options: Omit<AWS.S3.GetObjectRequest, 'Bucket' | 'Key'>
  ) {
    const param = { ...options, Bucket: this.bucket, Key: key }
    const res = await this.service.getObject(param).promise()
    return { data: res.Body }
  }
}

export default S3Storage
