import { Injectable } from '@nestjs/common';
import { InitializeTransactionDto } from './dto/payment.dto';
import { PaystackCallbackDto, PaystackWebhookDto } from './dto/paystack.dto';

@Injectable()
export abstract class PaymentService {
  abstract initializePayment(
    initializeTransactionDto: InitializeTransactionDto,
  ): Promise<any>;
  abstract verifyPayment(
    verifyCallbackPaymentDto: PaystackCallbackDto,
  ): Promise<any>;
  abstract webhook(
    verifyWebhookDto: PaystackWebhookDto,
    signature: string,
  ): Promise<any>;
  abstract fetchPayment(id: number): Promise<any>;
}
