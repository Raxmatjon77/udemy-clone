import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { CreateLessonRequest, UpdateLessonRequest } from '../interfaces'

export class CreateLessonDto implements CreateLessonRequest {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  videoUrl: string

  @IsBoolean()
  @IsNotEmpty()
  freePreview: boolean

  @IsString()
  @IsNotEmpty()
  sectionId: string

  @IsNumber()
  @IsNotEmpty()
  order: number
}

export class UpdateLessonDto implements UpdateLessonRequest {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  videoUrl: string

  @IsBoolean()
  @IsOptional()
  freePreview: boolean

  @IsString()
  @IsOptional()
  sectionId: string

  @IsNumber()
  @IsOptional()
  order: number
}
