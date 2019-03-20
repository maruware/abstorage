import { S3 } from 'aws-sdk'
import { Omit } from 'type-fest'
import BaseStorage, { Body, GetDataTypeOption, GetReturn } from './storage'
import { Stream } from 'stream'

export interface S3StorageArgs extends S3.ClientConfiguration {
  bucket: string
  host?: string
}

type PutOptions = Omit<S3.Types.PutObjectRequest, 'Bucket' | 'Key' | 'Body'>
type GetS3Options = Omit<S3.GetObjectRequest, 'Bucket' | 'Key'>
type GetOption<T extends 'buffer' | 'stream'> = GetS3Options &
  GetDataTypeOption<T>

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

  put(key: string, body: Body, options: PutOptions) {
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
    options?: GetOption<'buffer'>
  ): Promise<GetReturn<Buffer>>
  async get(
    key: string,
    options?: GetOption<'stream'>
  ): Promise<GetReturn<Stream>>
  async get(
    key: string,
    { dataType, ...options }: GetOption<any> = {
      dataType: 'buffer'
    }
  ): Promise<GetReturn<any>> {
    const param = { ...options, Bucket: this.bucket, Key: key }
    const req = this.service.getObject(param)
    if (dataType === 'buffer') {
      const res = await req.promise()
      return { data: res.Body }
    } else {
      return { data: req.createReadStream() }
    }
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
