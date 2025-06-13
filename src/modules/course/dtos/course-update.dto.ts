import { UpdateCourseRequest } from '../interfaces'
import { Type } from 'class-transformer'
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator'

export class UpdateCourseDto implements UpdateCourseRequest {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  slug?: string

  @IsString()
  @IsOptional()
  desc?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isPublished?: boolean

  @IsString()
  @IsOptional()
  categoryId?: string

  @IsString()
  @IsOptional()
  authorId?: string
}
