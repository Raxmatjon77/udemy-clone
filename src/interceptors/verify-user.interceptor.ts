import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class VerivyUserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const ip = process.env.NODE_ENV === 'production' ? request.headers['X-Real-IP'] : request.ip
    const device = process.env.NODE_ENV === 'production' ? request.headers['User-Agent'] : request.headers['user-agent']
    const deviceId = request.headers['X-Device-Id']

    Object.assign(request.body, {
      ip,
      device,
      deviceId,
    })

    return next.handle()
  }
}
