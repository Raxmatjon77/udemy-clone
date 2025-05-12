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

@Controller("upload")
export class VideoUploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post("init")
  async initUpload(@Query("key") key: string) {
    const uploadId = await this.s3Service.initUpload("test", key);
    console.log(uploadId);
    return { uploadId };
  }

  @Post("chunk")
  @UseInterceptors(FileInterceptor("chunk"))
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      key: string;
      uploadId: string;
      partNumber: number;
    }
  ) {
    const part = await this.s3Service.uploadPart(
      "test",
      body.key,
      body.uploadId,
      Number(body.partNumber),
      file.buffer
    ).catch((err) => {
      console.log(err);
      throw err;
    });

    return part;
  }

  @Post("complete")
  async completeUpload(
    @Body()
    body: {
      key: string;
      uploadId: string;
      parts: { ETag: string; PartNumber: number }[];
    }
  ) {
    console.log(body);
    const result = await this.s3Service.completeUpload(
      "test",
      body.key,
      body.uploadId,
      body.parts
    );
    return result;
  }
}
