import { Injectable, Inject } from '@nestjs/common';
import { UploadHandler } from './upload-handlers.gateway';

@Injectable()
export class UploadHandlersService {
  constructor(
    @Inject(UploadHandler) private readonly uploadHandler: UploadHandler,
  ) {}

  uploadFile(file: Express.Multer.File): Promise<string> {
    return this.uploadHandler.uploadFile(file);
  }

  deleteFile(url: string): Promise<void> {
    return this.uploadHandler.deleteFile(url);
  }
}
