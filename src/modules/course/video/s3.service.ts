import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CompletedPart,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { PassThrough } from "stream";

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: "us-east-1",
      endpoint: process.env.MINIO_URL, // your MinIO endpoint
      credentials: {
        accessKeyId: process.env.MINIO_USER,
        secretAccessKey: process.env.MINIO_PASS,
      },
      forcePathStyle: true, // required for MinIO
    });
  }

  async initUpload(bucket: string, key: string) {
    const command = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await this.s3.send(command);
    return response.UploadId;
  }

  async uploadPart(
    bucket: string,
    key: string,
    uploadId: string,
    partNumber: number,
    body: Buffer
  ) {
    const command = new UploadPartCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: body,
    });
    const response = await this.s3.send(command);
    return {
      ETag: response.ETag,
      PartNumber: partNumber,
    };
  }

  async completeUpload(
    bucket: string,
    key: string,
    uploadId: string,
    parts: CompletedPart[]
  ) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });
    return await this.s3.send(command);
  }

  async getVideoStream(bucket: string, key: string, range: string) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: range,
    });

    const response = await this.s3.send(command);
    const stream = response.Body as unknown as PassThrough;
    const contentLength = Number(response.ContentLength);
    const contentType = response.ContentType;
    const contentRange = response.ContentRange;

    return { stream, contentLength, contentType, contentRange };
  }
}
