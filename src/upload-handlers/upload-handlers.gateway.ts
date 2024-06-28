import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { extractKeyFromUrl } from '../common/utils/uploadUrlKey';

// Enum for Upload Service Types
export enum UploadServiceType {
  S3 = 's3',
  Spaces = 'spaces',
  Local = 'local',
}

// Abstract Class for Upload Handler
export abstract class UploadHandler {
  abstract uploadFile(file: Express.Multer.File): Promise<string>;
  abstract deleteFile(url: string): Promise<void>;
}

// S3 Upload Handler
@Injectable()
export class S3UploadHandler extends UploadHandler {
  private s3: S3;

  constructor(private configService: ConfigService) {
    super();
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  async deleteFile(url: string): Promise<void> {
    const key = extractKeyFromUrl(url);

    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file from S3');
    }
  }
}

// Spaces Upload Handler
@Injectable()
export class SpacesUploadHandler extends UploadHandler {
  private spaces: S3;

  constructor(private configService: ConfigService) {
    super();
    this.spaces = new S3({
      endpoint: this.configService.get<string>('SPACES_ENDPOINT'),
      accessKeyId: this.configService.get<string>('SPACES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>(
        'SPACES_SECRET_ACCESS_KEY',
      ),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.configService.get<string>('SPACES_BUCKET_NAME'),
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    try {
      const result = await this.spaces.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file to Spaces');
    }
  }

  async deleteFile(url: string): Promise<void> {
    const key = extractKeyFromUrl(url);

    const params = {
      Bucket: this.configService.get<string>('SPACES_BUCKET_NAME'),
      Key: key,
    };

    try {
      await this.spaces.deleteObject(params).promise();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete file from Spaces',
      );
    }
  }
}

// Local Directory Upload Handler
@Injectable()
export class LocalDirectoryUploadHandler extends UploadHandler {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    super();
    this.uploadDir = this.configService.get<string>('LOCAL_UPLOAD_DIR');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath = join(this.uploadDir, `${Date.now()}-${file.originalname}`);

    try {
      await fs.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload file to local directory',
      );
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete file from local directory',
      );
    }
  }
}
