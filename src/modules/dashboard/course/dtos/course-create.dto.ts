import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator'
import { CreateCourseRequest } from '../interfaces'
import { Type } from 'class-transformer'
export class CreateCourseDto implements Omit<CreateCourseRequest, 'image'> {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  slug: string

  @IsString()
  @IsNotEmpty()
  desc: string

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  thumbnail: string

  @IsBoolean()
  @Type(() => Boolean)
  @IsNotEmpty()
  isPublished: boolean

  @IsString()
  @IsNotEmpty()
  categoryId: string

  @IsString()
  @IsNotEmpty()
  authorId: string
}
