import { Injectable, Inject } from '@nestjs/common';
import { UploadHandler } from './upload-handlers.gateway';
// import { Express } from 'express';

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




// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { UploadHandlersRepository } from './upload-handlers.repostiory';

// @Injectable()
// export class UploadHandlersService {
//   constructor(
//     private readonly uploadHandlersRepository: UploadHandlersRepository,
//   ) {}

//   async uploadToSpaces(file: Express.Multer.File): Promise<string> {
//     try {
//       const result = await this.uploadHandlersRepository.uploadToSpaces(file);
//       return result.Location;
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to upload file to Spaces');
//     }
//   }

//   async uploadToS3(file: Express.Multer.File): Promise<string> {
//     try {
//       const result = await this.uploadHandlersRepository.uploadToS3(file);
//       return result.Location;
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to upload file to S3');
//     }
//   }

//   async uploadToLocalDirectory(file: Express.Multer.File): Promise<string> {
//     try {
//       const result =
//         await this.uploadHandlersRepository.uploadToLocalDirectory(file);
//       return result;
//     } catch (error) {
//       throw new InternalServerErrorException(
//         'Failed to upload file to local directory',
//       );
//     }
//   }

//   async deleteFromSpaces(url: string): Promise<void> {
//     try {
//       const key = this.extractKeyFromUrl(url);
//       await this.uploadHandlersRepository.deleteFileFromSpaces(key);
//     } catch (error) {
//       throw new InternalServerErrorException(
//         'Failed to delete file from Spaces',
//       );
//     }
//   }

//   async deleteFromS3(url: string): Promise<void> {
//     try {
//       const key = this.extractKeyFromUrl(url);
//       await this.uploadHandlersRepository.deleteFileFromS3(key);
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to delete file from S3');
//     }
//   }

//   private extractKeyFromUrl(url: string): string {
//     const parsedUrl = new URL(url);
//     return decodeURIComponent(parsedUrl.pathname.substring(1)); // Extract key from URL
//   }
// }
