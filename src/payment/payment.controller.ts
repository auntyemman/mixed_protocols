import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('transactions')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/initialize')
  async initializePayment(@Body() initializePaymentDto: CreatePaymentDto) {
    return await this.paymentService.initializePayment(initializePaymentDto);
  }

  @Get('/callback')
  async verifyPayment(@Query() verifyPaymentDto: any): Promise<any> {
    return await this.paymentService.verifyPayment(verifyPaymentDto);
  }

  @Get('/webhook')
  @HttpCode(HttpStatus.OK)
  async paymentWebhook(
    @Body() paymentWebhookDto: any,
    @Headers() headers = {},
  ): Promise<any> {
    const result = await this.paymentService.paymentWebhook(
      paymentWebhookDto,
      `${headers['x-paystack-signature']}`,
    );
    if (!result) {
      throw new BadRequestException('Invalid signature');
    }
  }

  @Get('/all-payments')
  async findPayemnts(): Promise<any> {
    return await this.paymentService.findPayemnts();
  }
}
