import { IsString } from "class-validator";
import { VideoUploadChunk } from "../interfaces";
export class ChunkUploadDto
  implements Omit<Omit<VideoUploadChunk, "bucket">, "body">
{
  @IsString()
  key: string;

  @IsString()
  uploadId: string;

  @IsString()
  partNumber: string;
}
