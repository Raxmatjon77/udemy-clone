import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as bodyParser from 'body-parser'
import { LoggerInterceptor } from '@interceptors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(bodyParser.json({ limit: '5mb' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })

  app.setGlobalPrefix('api/v1')
  app.useGlobalInterceptors(new LoggerInterceptor());

  app.enableShutdownHooks()
  await app.listen(4000)
}
bootstrap()
