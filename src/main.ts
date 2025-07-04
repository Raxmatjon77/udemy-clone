// import { NestFactory } from '@nestjs/core'
// import { AppModule } from './app.module'
// import { ValidationPipe } from '@nestjs/common'
// import * as bodyParser from 'body-parser'
// import { LoggerInterceptor } from '@interceptors'

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule)

//   app.use(bodyParser.json({ limit: '5mb' }))
//   app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
//   app.useGlobalPipes(new ValidationPipe())
//   app.enableCors({
//     origin: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     credentials: true,
//   })

//   app.setGlobalPrefix('api/v1')
//   app.useGlobalInterceptors(new LoggerInterceptor());

//   app.enableShutdownHooks()
//   await app.listen(4000)
// }
// bootstrap()

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cluster from 'node:cluster';
import os from 'node:os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork(); // Optional: restart on crash
  });
} else {
  bootstrap();
}
