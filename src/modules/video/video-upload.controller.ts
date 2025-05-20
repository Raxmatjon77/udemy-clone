import {
  Controller,
  Post,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "./s3.service";
import { ChunkUploadDto, UploadCompleteDto } from "./dtos";
import {
  VideoUploadChunkResponse,
  VideoUploadInitResponse,
} from "./interfaces";

@Controller("upload")
export class VideoUploadController {
  readonly #_service: S3Service;
  readonly #_bucket: string;
  constructor(s3Service: S3Service) {
    this.#_service = s3Service;
    this.#_bucket = process.env.MINIO_BUCKET_VIDEO;
  }

  @Post("init")
  async initUpload(
    @Query("key") key: string,
  ): Promise<VideoUploadInitResponse> {
    const uploadId = await this.#_service.initUpload({
      bucket: this.#_bucket,
      key,
    });
    return { uploadId };
  }

  @Post("chunk")
  @UseInterceptors(FileInterceptor("chunk"))
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: ChunkUploadDto,
  ): Promise<VideoUploadChunkResponse> {
    return await this.#_service.uploadPart({
      bucket: this.#_bucket,
      key: body.key,
      uploadId: body.uploadId,
      partNumber: body.partNumber,
      body: file.buffer,
    });
  }

  @Post("complete")
  async completeUpload(
    @Body()
    body: UploadCompleteDto,
  ): Promise<void> {
    await this.#_service.completeUpload(this.#_bucket, body);
  }
}
