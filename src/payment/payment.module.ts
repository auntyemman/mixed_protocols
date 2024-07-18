import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaystackService } from './paystack.service';
import { PaymentRepository } from './payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { ProductModule } from '../product/product.module';
import { UsersModule } from 'src/users/users.module';
import { ProductService } from '../product/product.service';
import { ProductRepository } from 'src/product/product.repository';
@Module({
  imports: [
    ProductModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [PaymentController],
  providers: [
    {
      provide: PaymentService,
      useClass: PaystackService,
    },
    PaymentRepository,
  ],
})
export class PaymentModule {}
