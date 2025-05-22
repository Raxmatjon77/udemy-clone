import { Controller, Get, Param, Req, Res, BadRequestException } from '@nestjs/common'
import { Response, Request } from 'express'
import { S3Service } from './s3.service'

@Controller('stream')
export class StreamController {
  readonly #_service: S3Service
  readonly #_bucket: string
  constructor(s3Service: S3Service) {
    this.#_service = s3Service
    this.#_bucket = process.env.MINIO_BUCKET_VIDEO
  }

  @Get(':key')
  async streamVideo(@Param('key') key: string, @Req() req: Request, @Res() res: Response) {
    const range = req.headers.range
    if (!range) {
      throw new BadRequestException('Requires Range header')
    }

    const { stream, contentRange, contentLength, contentType } = await this.#_service.getVideoStream(
      this.#_bucket,
      key,
      range,
    )

    res.writeHead(206, {
      'Content-Range': contentRange,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': contentType,
    })

    stream.pipe(res)
  }
}
