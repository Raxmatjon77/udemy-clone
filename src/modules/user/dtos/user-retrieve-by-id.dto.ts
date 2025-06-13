import { IsString } from 'class-validator'
import { UserRetreiveByIdRequestInterface } from '../../auth/interface'

export class UserRetrieveByIdDto implements UserRetreiveByIdRequestInterface {
  @IsString()
  id: string
}
