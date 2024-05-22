import { Module } from '@nestjs/common';
import { UploadHandlersService } from './upload-handlers.service';
import { UploadHandlersRepository } from './upload-handlers.repostiory';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
  ],
  controllers: [],
  providers: [UploadHandlersService, UploadHandlersRepository],
})
export class UploadHandlersModule {}
