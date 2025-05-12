// stream.controller.ts
import { Controller, Get, Header, Param, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { S3Service } from "./s3.service";

@Controller("stream")
export class StreamController {
  constructor(private readonly s3Service: S3Service) {}

  @Get(":key")
  async streamVideo(
    @Param("key") key: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const range = req.headers.range;
    if (!range) {
      return res.status(400).send("Requires Range header");
    }

    const { stream, contentRange, contentLength, contentType } =
      await this.s3Service.getVideoStream("test", key, range);

    res.writeHead(206, {
      "Content-Range": contentRange,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": contentType,
    });

    stream.pipe(res);
  }
}
