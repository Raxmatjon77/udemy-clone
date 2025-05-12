import { Module } from "@nestjs/common";
import { VideoUploadController } from "./video-upload.controller";
import { S3Service } from "./s3.service";
import { MinioModule } from "@modules";
import { StreamController } from "./stream.controller";
@Module({
  controllers: [VideoUploadController, StreamController],
  providers: [S3Service],
  imports: [MinioModule],
})
export class VideoModule {}
