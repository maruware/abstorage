import { S3 } from 'aws-sdk'
import { Stream } from 'stream'

export type Body = S3.Body

export interface GetReturn<DataType extends Buffer | Stream> {
  data: DataType
}

export interface GetDataTypeOption<DataTypeCode extends 'buffer' | 'stream'> {
  dataType?: DataTypeCode
}

abstract class Storage {
  abstract put(key: string, body: Body, options?: any): Promise<any>
  abstract get(
    key: string,
    options?: GetDataTypeOption<'buffer'>
  ): Promise<GetReturn<Buffer>>
  abstract get(
    key: string,
    options?: GetDataTypeOption<'stream'>
  ): Promise<GetReturn<Stream>>
  abstract get(key: string, options?: GetDataTypeOption<any>): any
  abstract resolveUrl(key: string): string
}

export default Storage
