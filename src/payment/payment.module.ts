import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaystackService } from './paystack.service';

@Module({
  controllers: [PaymentController],
  providers: [
    {
      provide: PaymentService,
      useClass: PaystackService,
    },
  ],
})
export class PaymentModule {}
