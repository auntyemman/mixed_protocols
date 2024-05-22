import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
// import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadHandlersRepository {
  private readonly s3: S3 = new S3({
    endpoint: this.configService.getOrThrow('SPACES_ENDPOINT'),
    region: this.configService.getOrThrow('SPACES_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('SPACES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow(
        'SPACES_SECRET_ACCESS_KEY',
      ),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadToS3(file: Express.Multer.File): Promise<ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: `S3_FOLDER/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };
    return await this.s3.upload(params).promise();
  }

  async uploadToSpaces(
    file: Express.Multer.File,
  ): Promise<ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: this.configService.getOrThrow('SPACES_BUCKET_NAME'),
      Key: `SPACES_FOLDER/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
    };
    return await this.s3.upload(params).promise();
  }

  async uploadToLocalDirectory(file: Express.Multer.File): Promise<string> {
    const cleanFileName = file.originalname.replace(/\s/g, '-');
    const uploadDirectory = 'uploads'; // Define your upload directory
    const fileName = `${Date.now()}-${cleanFileName}`;
    const filePath = join(uploadDirectory, fileName);

    // Create upload directory if not exists
    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    // Write file to local directory
    writeFileSync(filePath, file.buffer);

    // Return file path
    return filePath;
  }

  async deleteFileFromS3(key: string): Promise<void> {
    const params: S3.DeleteObjectRequest = {
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: key,
    };
    await this.s3.upload(params).promise();
  }

  async deleteFileFromSpaces(key: string): Promise<void> {
    const params: S3.DeleteObjectRequest = {
      Bucket: this.configService.getOrThrow('SPACES_BUCKET_NAME'),
      Key: key,
    };
    await this.s3.deleteObject(params).promise();
  }
}
