import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentPayload, CreatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
// import { ProductService } from '../product/product.service';
import {
  PaystackCreateTransactionDto,
  PaystackMetadata,
  PaystackCreateTransactionResponseDto,
  PaystackCallbackDto,
  PaystackVerifyTransactionResponseDto,
  PaymentStatus,
  PaystackWebhookDto,
} from './dto/paystack.dto';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import {
  PAYSTACK_TRANSACTION_INI_URL,
  PAYSTACK_TRANSACTION_VERIFY_BASE_URL,
  PAYSTACK_FETCH_TRANSACTION_URL,
  PAYSTACK_SUCCESS_STATUS,
  PAYSTACK_WEBHOOK_CRYPTO_ALGO,
  KOBO,
} from 'src/common/utils/constants';
import { createHmac, timingSafeEqual } from 'crypto';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaystackService extends PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async initializePayment(paymentPayload: PaymentPayload): Promise<any> {
    const { email, amount, orderId, userId, items, product } = paymentPayload;

    const metadata: PaystackMetadata = {
      user_id: userId,
      product_id: orderId,
      custom_fields: [
        {
          display_name: `${product[0].name}`,
          variable_name: 'Mole goods',
          value: amount,
        },
      ],
    };
    const amountInKobo = amount * KOBO;
    const paystackCreateTransactionDto: PaystackCreateTransactionDto = {
      email: email,
      amount: amountInKobo,
      metadata,
    };

    // overriding paystack callback url in the web settings (Paystack Dashboard). this block of code is optional
    // const paystackCallbackUrl = this.configService.get<string>(
    //   'PAYSTACK_CALLBACK_URL',
    // );
    // if (!paystackCallbackUrl) {
    //   throw new Error('PAYSTACK_CALLBACK_URL is not defined');
    // }
    // paystackCreateTransactionDto.callback_url = paystackCallbackUrl;
    const payload = JSON.stringify(paystackCreateTransactionDto);
    let result: PaystackCreateTransactionResponseDto;

    try {
      const response = await axios.post<PaystackCreateTransactionResponseDto>(
        PAYSTACK_TRANSACTION_INI_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>(
              'PAYSTACK_PRIVATE_KEY',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      );
      result = response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to initialize payment with Paystack',
      );
    } finally {
      const data = result.data;
      if (result.status === true) {
        const createPaymentDto: CreatePaymentDto = {
          orderId: orderId,
          userId: userId,
          paymentReference: data.reference,
          paymentlink: data.authorization_url,
        };
        return await this.paymentRepository.createPayment(createPaymentDto);
      }
      return null;
    }
  }

  async verifyPayment(dto: PaystackCallbackDto): Promise<any> {
    const { reference } = dto;
    const trxn =
      await this.paymentRepository.findePaymentByReference(reference);
    if (!trxn) {
      return null;
    }
    const trxnRef = trxn.paymentReference;
    const url = `${PAYSTACK_TRANSACTION_VERIFY_BASE_URL}/${trxnRef}`;
    let response: AxiosResponse<PaystackVerifyTransactionResponseDto>;

    try {
      response = await axios.get<PaystackVerifyTransactionResponseDto>(url, {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>(
            'PAYSTACK_PRIVATE_KEY',
          )}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to verify payment with Paystack',
      );
    } finally {
      if (!response) {
        return null;
      }
      const result = response.data;
      const transactionStatus = result?.data?.status;
      const isPaymentConfirmed = transactionStatus === PAYSTACK_SUCCESS_STATUS;
      if (isPaymentConfirmed) {
        trxn.paymentId = result.data.id;
        trxn.paymentStatus = PaymentStatus.paid;
        trxn.paymentAmount = result.data.amount;
        trxn.paymentFees = result.fees;
        trxn.paymentCurrency = result.data.currency;
        trxn.transactionDate = new Date(result.data.paid_at);
        trxn.paymentMethod = result.data.channel;
        await this.paymentRepository.updatePayment(trxn._id, trxn);
        return {
          orderId: trxn.orderId,
          status: true,
        };
      } else {
        trxn.paymentStatus = 'failed';
        await this.paymentRepository.updatePayment(trxn._id, trxn);
        return {
          orderId: trxn.orderId,
          status: false,
        };
      }
    }
  }

  async webhook(dto: PaystackWebhookDto, signature: string): Promise<any> {
    if (!dto.data) {
      return false;
    }
    let isValidEvent = false;

    try {
      const hash = createHmac(
        PAYSTACK_WEBHOOK_CRYPTO_ALGO,
        this.configService.get<string>('PAYSTACK_PRIVATE_KEY'),
      )
        .update(JSON.stringify(dto))
        .digest('hex');

      isValidEvent =
        hash &&
        signature &&
        timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to verify webhook signature with Paystack',
      );
    } finally {
      if (!isValidEvent) {
        return false;
      }
      const trxn = await this.paymentRepository.findePaymentByReference(
        dto.data.reference,
      );
      if (!trxn) {
        return null;
      }

      const result = dto;
      const transactionStatus = result?.data?.status;
      const isPaymentConfirmed = transactionStatus === PAYSTACK_SUCCESS_STATUS;
      if (isPaymentConfirmed) {
        trxn.paymentId = result.data.id;
        trxn.paymentStatus = PaymentStatus.paid;
        trxn.paymentAmount = result.data.amount;
        trxn.paymentFees = result.data.fees;
        trxn.paymentCurrency = result.data.currency;
        trxn.transactionDate = new Date(result.data.paid_at);
        trxn.paymentMethod = result.data.channel;
        await this.paymentRepository.updatePayment(trxn._id, trxn);
        return {
          orderId: trxn.orderId,
          status: true,
        };
      } else {
        trxn.paymentStatus = 'failed';
        await this.paymentRepository.updatePayment(trxn._id, trxn);
        return {
          orderId: trxn.orderId,
          status: false,
        };
      }
    }
  }

  async fetchPayment(id: number): Promise<any> {
    let result: any;
    try {
      const response = await axios.get<any>(
        `${PAYSTACK_FETCH_TRANSACTION_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>(
              'PAYSTACK_PRIVATE_KEY',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      );
      result = response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch payment with Paystack',
      );
    } finally {
      return result;
    }
  }
}
