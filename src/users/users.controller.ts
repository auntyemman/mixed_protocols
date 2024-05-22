import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  UseGuards,
  Res,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { GetUsersDto } from './dtos/getUsers.dto';
import { Response } from 'express';
import { UpdateUserDto } from './dtos/updateUser.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UploadHandlersService } from 'src/upload-handlers/upload-handlers.service';
// import { FileValidationPipe } from 'src/upload-handlers/upload-handlers.validation-pipe';
// import { Query, Resolver } from '@nestjs/graphql';

@ApiTags('users service')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private uploadHandlersService: UploadHandlersService,
  ) {}

  @ApiCreatedResponse({ type: User })
  @Post('create')
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(body);
  }

  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  @Patch('update/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  // @UsePipes(new FileValidationPipe(File))
  async UpdateUser(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
    },
    // @UploadedFiles(
    //   new ParseFilePipe({
    //     validators: [
    //       // new MaxFileSizeValidator({ maxSize: 1024 * 5 }),
    //       // new FileTypeValidator({ fileType: 'image/jpeg' }),
    //       // new FileTypeValidator({ fileType: 'text/plain' }),
    //     ],
    //   }),
    // )
    // files: {
    //   avatar?: Express.Multer.File[];
    // },
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const allowedMimeTypes = {
      avatar: ['image/jpeg', 'image/png', 'text/plain'],
    };
    const allowedFileSizes = {
      avatar: 1024 * 5,
    };
    let avatarPath: string;

    // Check if avatar is uploaded
    if (files.avatar) {
      // Upload avatar to local directory
      const avatarFile = files.avatar[0];
      if (
        avatarFile.mimetype &&
        !allowedMimeTypes.avatar.includes(avatarFile.mimetype)
      ) {
        throw new BadRequestException('Invalid file type');
      }
      if (avatarFile.size > allowedFileSizes.avatar) {
        throw new BadRequestException('File size exceeds the limit');
      }
      avatarPath =
        await this.uploadHandlersService.uploadToLocalDirectory(avatarFile);
    }
    body.avatar = avatarPath;
    const result = await this.usersService.updateUser(id, body);
    return res.status(200).json({ message: 'Success', data: result });
  }

  @ApiOkResponse({ type: [User] })
  @ApiBearerAuth()
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get('get-users')
  async getUsers(
    @Query() query: GetUsersDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.usersService.getUsers(query);
    return res.status(200).json({ message: 'Success', data: result });
  }
}
