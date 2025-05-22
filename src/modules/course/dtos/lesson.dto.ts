import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator'
import { CreateLessonRequest } from '../interfaces'

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
