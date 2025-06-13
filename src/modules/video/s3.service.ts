import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PassThrough } from 'stream'
import { VideoUploadChunk, VideoUploadChunkResponse, VideoUploadCompleteRequest, VideoUploadInit } from './interfaces'

@Injectable()
export class S3Service {
  private readonly s3: S3Client

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.MINIO_URL,
      credentials: {
        accessKeyId: process.env.MINIO_USER,
        secretAccessKey: process.env.MINIO_PASS,
      },
      forcePathStyle: true,
    })
  }

  async initUpload(payload: VideoUploadInit) {
    const command = new CreateMultipartUploadCommand({
      Bucket: payload.bucket,
      Key: payload.key,
    })

    const response = await this.s3.send(command)
    return response.UploadId
  }

  async uploadPart(payload: VideoUploadChunk): Promise<VideoUploadChunkResponse> {
    const command = new UploadPartCommand({
      Bucket: payload.bucket,
      Key: payload.key,
      UploadId: payload.uploadId,
      PartNumber: Number(payload.partNumber),
      Body: payload.body,
    })
    const response = await this.s3.send(command)
    return {
      ETag: response.ETag,
      PartNumber: payload.partNumber,
    }
  }

  async completeUpload(bucket: string, payload: VideoUploadCompleteRequest) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: payload.key,
      UploadId: payload.uploadId,
      MultipartUpload: { Parts: payload.parts },
    })
    return await this.s3.send(command)
  }

  async getVideoStream(bucket: string, key: string, range: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: range,
    })

    console.log(key)

    const response = await this.s3.send(command).catch((err) => {
      // console.log(err);
      throw new InternalServerErrorException(err)
    })
    const stream = response.Body as unknown as PassThrough
    const contentLength = Number(response.ContentLength)
    const contentType = response.ContentType
    const contentRange = response.ContentRange

    return { stream, contentLength, contentType, contentRange }
  }
}
