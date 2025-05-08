import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { SectionCreate } from "../interfaces";

export class SectionCreateDto implements SectionCreate {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
