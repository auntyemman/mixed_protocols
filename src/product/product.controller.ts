import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CreateCartDto, UpdateCartDto, ClearCartDto } from './dto/cart.dto';
import { CreateOrderDto } from './dto/order.dto';
import { from, Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post('/create')
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Post('/cart/add')
  async addToCart(@Body() createCartDto: CreateCartDto) {
    return await this.productService.addToCart(createCartDto);
  }

  @Patch('/cart/remove')
  async removeFromCart(@Body() updateCartDto: UpdateCartDto) {
    return await this.productService.removeFromCart(updateCartDto);
  }

  @Delete('/cart/clear')
  async clearCart(@Body() clearCartDto: ClearCartDto) {
    return await this.productService.clearCart(clearCartDto);
  }

  @Post('/order/create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.productService.createOrder(createOrderDto);
  }

  @Get('/order/items-total')
  async itemsTotal(@Body() items: any) {
    return await this.productService.itemsTotal(items);
  }

  // @Sse()
  // @Get('/order/payment-update')
  // async orderPaymentUpdate(): Observable<MessageEvent<any>> {
  //   return new Observable((subscriber) => {
  //     this.eventEmitter.on('payment success', (orderId) => {
  //       const update = await this.productService.orderPaymentUpdate(orderId);
  //       subscriber.next({ message: 'payment success', data: update });
  //     });
  //   });
  // }

  @Sse()
  @Get('/payment-update')
  orderPaymentUpdate(): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const handler = async (orderId: string) => {
        try {
          const update = from(
            await this.productService.orderPaymentUpdate(orderId),
          );
          subscriber.next({ data: { update } });
        } catch (error) {
          subscriber.error(error);
        }
      };

      this.eventEmitter.on('payment success', handler);

      // Clean up the event listener when the subscriber unsubscribes
      return () => {
        this.eventEmitter.off('payment success', handler);
      };
    });
  }
}
