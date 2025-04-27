import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class VerivyUserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.headers["X-Real-IP"];
    const device = request.headers["User-Agent"];
    const deviceId = request.headers["X-Device-Id"];

    Object.assign(request.body, {
      ip,
      device,
      deviceId,
    });

    return next.handle();
  }
}
