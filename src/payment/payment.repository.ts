import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaystackCallbackDto, PaystackWebhookDto } from './dto/paystack.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
  ) {}

  async createPayment(payment: CreatePaymentDto): Promise<Payment> {
    const createdProduct = await this.paymentModel.create(payment);
    if (!createdProduct) {
      throw new Error('Failed to create payment');
    }
    return createdProduct;
  }

  async findPaymentById(id: string): Promise<PaymentDocument> {
    return await this.paymentModel.findOne({ _id: id });
  }

  async findePaymentByReference(reference: string): Promise<PaymentDocument> {
    return await this.paymentModel.findOne({ paymentReference: reference });
  }

  async updatePayment(
    id: string,
    payment: Partial<Payment>,
  ): Promise<PaymentDocument> {
    const update = await this.paymentModel.findByIdAndUpdate(id, payment, {
      new: true,
    });
    if (!update) {
      throw new Error('Failed to update payment');
    }
    return update;
  }

  async findPaymentByUserId(serId: string): Promise<Payment> {
    return await this.paymentModel.findOne({ serId: serId });
  }
}
