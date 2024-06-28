import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InitializeTransactionDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';
import { ProductService } from '../product/product.service';
import {
  PaystackCreateTransactionDto,
  PaystackMetadata,
  PaystackCreateTransactionResponseDto,
} from './dto/paystack.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PAYSTACK_TRANSACTION_INI_URL } from 'src/common/utils/constants';

@Injectable()
export class PaystackService extends PaymentService {
  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async initializePayment(
    initializeTransactionDto: InitializeTransactionDto,
  ): Promise<any> {
    const { productId } = initializeTransactionDto;
    const product = {
      id: productId,
      name: 'TV',
      price: 1000,
      description: 'Product 1 description',
    };

    const user = {
      id: 1,
      name: 'John Doe',
      email: 'XVYJZ@example.com',
      address: '123 Main St',
    }

    const metadata: PaystackMetadata = {
      user_id: user.id,
      product_id: product.id,
      custom_fields: [
        {
          display_name: product.name,
          variable_name: 'LG',
          value: product.price,
        }
      ],
    };
    const paystackCreateTransactionDto: PaystackCreateTransactionDto = {
      email: user.email,
      amount: product.price,
      metadata,
    };
    
    // overriding paystack callback url in the web settings (Paystack Dashboard). this block of code is optional
    const paystackCallbackUrl = this.configService.get<string>(
      'PAYSTACK_CALLBACK_URL',
    );
    if (!paystackCallbackUrl) {
      throw new Error('PAYSTACK_CALLBACK_URL is not defined');
    }
    paystackCreateTransactionDto.callback_url = paystackCallbackUrl;
    const payload = JSON.stringify(paystackCreateTransactionDto);
    let result: PaystackCreateTransactionResponseDto;

    try {
        const reponse = await axios.post<PaystackCreateTransactionResponseDto>(
            PAYSTACK_TRANSACTION_INI_URL,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${this.configService.get<string>(
                        'PAYSTACK_SECRET_KEY',
                    )}`;
                    'Content-Type': 'application/json',  
                }
            }
        );
        result = reponse.data; 
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to initialize payment with Paystack',
      );
    } finally {
        const data = result.data;
        if (result.status === true) {
          return {
            authorization_url: data.authorization_url,
            access_code: data.access_code,
            reference: data.reference,
            message: 'Payment initialized with Paystack',
          };
        }
        return null;
    }
  }

  async verifyPayment(): Promise<any> {
    // Implement Paystack verification logic here
    return { message: 'Payment verified with Paystack' };
  }

  async webhook(): Promise<any> {
    // Implement Paystack webhook logic here
    return { message: 'Payment webhook received' };
  }
}
