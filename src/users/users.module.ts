import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersResolver } from './users.resolver';
import { UploadHandler } from 'src/upload-handlers/upload-handlers.gateway';
import { UploadHandlersModule } from '../upload-handlers/upload-handlers.module';
// import { UploadHandlersService } from 'src/upload-handlers/upload-handlers.service';
// import { UploadHandlersRepository } from 'src/upload-handlers/upload-handlers.repostiory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    /** JWT Module */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    UploadHandlersModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    UsersResolver,
    // UploadHandlersService,
    // UploadHandlersRepository,
  ],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
