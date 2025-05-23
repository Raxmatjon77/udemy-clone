import { IsNotEmpty, IsString } from 'class-validator'
import { CreateEnrollmentRequest } from '../interfaces'

export class CreateEnrollmentDto implements Omit<CreateEnrollmentRequest, 'userId'> {
  @IsString()
  @IsNotEmpty()
  courseId: string
}
