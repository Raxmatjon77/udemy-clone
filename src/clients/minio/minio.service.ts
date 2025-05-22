import { Injectable } from '@nestjs/common'
import { Client } from 'minio'

@Injectable()
export class MinioService {
  private readonly minioClient: Client

  constructor() {
    this.minioClient = new Client({
      endPoint: 'localhost',
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_USER,
      secretKey: process.env.MINIO_PASS,
    })
  }

  async uploadFile(bucket: string, file: Express.Multer.File): Promise<string> {
    const objectName = `${Date.now()}-${file.originalname}`

    await this.minioClient
      .putObject(bucket, objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      })
      .catch((err) => {
        console.log(err)
      })

    return objectName
  }

  async getFileUrl(bucket: string, objectName: string): Promise<string> {
    return await this.minioClient.presignedGetObject(bucket, objectName)
  }

  async deleteFile(bucket: string, objectName: string): Promise<void> {
    await this.minioClient.removeObject(bucket, objectName)
  }
}
