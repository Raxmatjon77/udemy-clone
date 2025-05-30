import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateReviewRequest } from "../interfaces";

export class CreateReviewDto implements Partial<CreateReviewRequest> {
  @IsString()
  @IsNotEmpty()
  comment: string

  @IsNotEmpty()
  @IsNumber()
  rating: number
}