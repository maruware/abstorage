import { S3 } from 'aws-sdk'

export type Body = S3.Body
abstract class Storage {
  abstract put(key: string, body: Body, options?: any): Promise<any>
  abstract get(key: string, options?: any): Promise<any>
}

export default Storage
