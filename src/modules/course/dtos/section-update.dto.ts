import { IsNumber, IsString } from 'class-validator'
import { SectionUpdate } from '../interfaces'
export class SectionUpdateDto implements SectionUpdate {
  @IsString()
  title: string

  @IsNumber()
  order: number

  @IsString()
  courseId: string
}
