import { Injectable } from '@nestjs/common';
import { InitializeTransactionDto } from './dto/create-payment.dto';

//@Injectable()
export abstract class PaymentService {
  abstract initializePayment(
    initializeTransactionDto: InitializeTransactionDto,
  ): Promise<any>;
  abstract verifyPayment(): Promise<any>;
  abstract webhook(): Promise<any>;
}
