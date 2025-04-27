import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { tap, throwError } from "rxjs";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = uuidv4();
    const startTime = Date.now();

    const requestLog = {
      timestamp: new Date().toISOString(),
      type: "REQUEST",
      requestId,
      method: request.method,
      url: request.url,
      ip: request.ip,
      Headers: request.headers,
      body: Object.keys(request.body).length ? request.body : undefined,
      params: Object.keys(request.params).length ? request.params : undefined,
      query: Object.keys(request.query).length ? request.query : undefined,
    };

    console.log(JSON.stringify(requestLog));

    return next.handle().pipe(
      tap((responseData) => {
        const endTime = Date.now();
        console.log(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            type: "RESPONSE",
            requestId,
            duration: `${endTime - startTime}ms`,
            statusCode: context.switchToHttp().getResponse().statusCode,
            response: responseData ?? undefined,
          }),
        );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const status = error instanceof HttpException ? error.getStatus() : 500;

        console.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            type: "ERROR",
            requestId,
            duration: `${endTime - startTime}ms`,
            statusCode: status,
            message: error.message,
            // stack: error.stack,
          }),
        );

        return throwError(() =>
          error instanceof HttpException
            ? error
            : new InternalServerErrorException(error.message),
        );
      }),
    );
  }
}
