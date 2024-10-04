import { Injectable } from '@nestjs/common';
import { createReadStream, statSync } from 'node:fs';
import { ReadStream } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class DataStreamsService {
  // Dynamically create a read stream based on the byte range
  async streamVideo(
    range: string,
  ): Promise<{ stream: ReadStream; size: number; start: number; end: number }> {
    // Get the start byte number
    const start = Number(range.replace(/\D/g, ''));

    // In real app, this will come from s3 bucket and cdn like AWS cloudfront for caching
    const videoPath = './src/data-streams/video.mp4';
    const videoSize = statSync(videoPath).size; // Get the video file size
    const NUMBER_OF_CHUNKS = 1 * 1024 * 1024; // 1 MB
    // Get the end byte by the incremental number of chunks or the video size when chunk is bigger than the video size
    const end = Math.min(start + NUMBER_OF_CHUNKS - 1, videoSize - 1);

    // Create the read stream from fs
    const videoStream = createReadStream(videoPath, {
      start,
      end,
    });
    return { stream: videoStream, size: videoSize, start: start, end: end };
  }
}
