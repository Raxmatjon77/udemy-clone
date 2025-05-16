import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";
import { VideoUploadCompleteRequest } from "../interfaces";

export class UploadCompleteDto implements VideoUploadCompleteRequest {
  @IsString()
  key: string;

  @IsString()
  uploadId: string;

  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  parts: { ETag: string; PartNumber: number }[];
}
