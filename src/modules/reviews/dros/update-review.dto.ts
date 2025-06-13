import { IsNumber, IsOptional, IsString } from 'class-validator'
import { UpdateReviewRequest } from '../interfaces'

export class UpdateReviewDto implements Partial<UpdateReviewRequest> {
  @IsString()
  @IsOptional()
  comment: string

  @IsOptional()
  @IsNumber()
  rating: number
}
