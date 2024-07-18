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
  UnprocessableEntityException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializeTransactionDto, PaymentPayload } from './dto/payment.dto';
import { PaystackCallbackDto, PaystackWebhookDto } from './dto/paystack.dto';
import { ProductService } from 'src/product/product.service';
import { UsersService } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('transactions')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly productService: ProductService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('/initialize')
  async initializePayment(
    @Body() initializePaymentDto: InitializeTransactionDto,
  ): Promise<any> {
    const { orderId, userId } = initializePaymentDto;
    const order = await this.productService.findOrder(orderId);
    const user = await this.usersService.getUserById(userId);

    if (!order || !user) {
      throw new BadRequestException('Invalid order or user');
    }
    const products: any = [];
    for (const item of order.items) {
      const product = await this.productService.getProduct(item.productId);
      if (!product) {
        throw new BadRequestException('Invalid product');
      }
      products.push(product);
    }
    const paymentPayload: PaymentPayload = {
      email: user.email,
      amount: order.total,
      orderId: orderId,
      userId: userId,
      items: order.items,
      product: products,
    }
    return await this.paymentService.initializePayment(paymentPayload);
  }

  @Get('/callback')
  async verifyPayment(
    @Query() verifyPaymentDto: PaystackCallbackDto,
  ): Promise<boolean> {
    const { orderId, status } =
      await this.paymentService.verifyPayment(verifyPaymentDto);
    if (status === false) {
      throw new UnprocessableEntityException('Unable to verify payment');
    }
    this.eventEmitter.emit('payment success', orderId);
    return true;
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async paymentWebhook(
    @Body() paymentWebhookDto: PaystackWebhookDto,
    @Headers() headers = {},
  ): Promise<any> {
    const result = await this.paymentService.webhook(
      paymentWebhookDto,
      `${headers['x-paystack-signature']}`,
    );
    if (!result) {
      throw new BadRequestException('Invalid signature');
    }
  }

  @Get('/fetch/:id')
  async findPayment(@Param('id', ParseIntPipe) id: number): Promise<any> {
    console.log(id);
    return await this.paymentService.fetchPayment(id);
  }

  //   @Get('/all-payments')
  //   async findPayemnts(): Promise<any> {
  //     return await this.paymentService.findPayemnts();
  //   }
}
