import { Controller } from '@nestjs/common';
import { UploadHandlersService } from './upload-handlers.service';

@Controller('upload-handlers')
export class UploadHandlersController {
  constructor(private readonly uploadHandlersService: UploadHandlersService) {}
}
