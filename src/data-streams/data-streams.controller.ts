import { Controller, Get, Res, HttpStatus, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { DataStreamsService } from './data-streams.service';

@Controller('data-streams')
export class DataStreamsController {
  constructor(private readonly dataStreamsService: DataStreamsService) {}

  @Get('video')
  async streamVideo(@Req() req: Request, @Res() res: Response) {
    const range = req.headers.range || 'bytes=0-';
    // if (!range) {
    //   return res.status(HttpStatus.BAD_REQUEST).send('Requires Range header');
    // }

    // Get the video stream from the service
    const { stream, size, start, end } =
      await this.dataStreamsService.streamVideo(range);
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    // Send the video stream
    res.writeHead(HttpStatus.PARTIAL_CONTENT, headers);
    // Pipe the video stream to the response
    stream.pipe(res);
  }
}
