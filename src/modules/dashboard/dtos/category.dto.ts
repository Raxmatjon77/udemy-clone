import { IsString, IsOptional } from "class-validator";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../interfaces";
export class CreateCategoryDto implements CreateCategoryRequest {
  @IsString()
  name: string;

  @IsString()
  slug: string;
}

export class UpdateCategoryDto implements Omit<UpdateCategoryRequest, "id"> {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;
}
