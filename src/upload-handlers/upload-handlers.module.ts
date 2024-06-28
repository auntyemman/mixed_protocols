import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadHandlersService } from './upload-handlers.service';
import {
  UploadHandler,
  S3UploadHandler,
  SpacesUploadHandler,
  LocalDirectoryUploadHandler,
  UploadServiceType,
} from './upload-handlers.gateway';

@Module({
  imports: [ConfigModule],
  providers: [
    UploadHandlersService,
    {
      provide: UploadHandler,
      useFactory: (configService: ConfigService): UploadHandler => {
        const uploadService =
          configService.get<UploadServiceType>('UPLOAD_SERVICE');
        switch (uploadService) {
          case UploadServiceType.S3:
            return new S3UploadHandler(configService);
          case UploadServiceType.Spaces:
            return new SpacesUploadHandler(configService);
          case UploadServiceType.Local:
            return new LocalDirectoryUploadHandler(configService);
          default:
            throw new Error('Invalid UPLOAD_SERVICE value');
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [UploadHandlersService],
})
export class UploadHandlersModule {}
