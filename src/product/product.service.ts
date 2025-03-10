import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ClearCartDto, CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { CreateOrderDto, Items, OrderStatus } from './dto/order.dto';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Order, OrderDocument } from './entities/order.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PaymentStatus } from 'src/payment/dto/paystack.dto';
import { Observable } from 'rxjs';
import { Model } from 'mongoose';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.createProduct(createProductDto);
  }


  async getProduct(id: string): Promise<Product> {
    return await this.productRepository.findProductById(id);
  }

  async addToCart(createCartDto: CreateCartDto): Promise<Cart> {
    const { cartId, userId, productId, quantity } = createCartDto;
    const cart = await this.productRepository.findCartById(cartId);
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        return await this.productRepository.updateCart(cartId, cart);
      } else {
        cart.items.push({ productId, quantity });
        return await this.productRepository.updateCart(cartId, cart);
      }
    } else {
      const newCart = await this.productRepository.createCart({
        userId,
        items: [{ productId, quantity }],
      });
      return newCart;
    }
  }

  async removeFromCart(updateCartDto: UpdateCartDto): Promise<Cart> {
    const { cartId, productId } = updateCartDto;
    const cart = await this.productRepository.findCartById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId,
    );
    return await this.productRepository.updateCart(cartId, cart);
  }

  async clearCart(clearCartDto: ClearCartDto): Promise<Cart> {
    const { cartId } = clearCartDto;
    return await this.productRepository.deleteCart(cartId);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const total = await this.itemsTotal(createOrderDto.items);
      console.log(total);
      createOrderDto.total = total;
      return await this.productRepository.createOrder(createOrderDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order..');
    }
  }

  async findOrder(id: string): Promise<Order> {
    return await this.productRepository.findOrderById(id);
  }

  async allOrders(): Promise<Order[]> {
    return await this.productRepository.allOrders();
  }

  @OnEvent('payment success')
  async orderPaymentUpdate(orderId: string): Promise<Order> {
    const order = await this.productRepository.findOrderById(orderId);
    order.paymentStatus = PaymentStatus.paid;
    order.status = OrderStatus.ACTIVE;
    return await this.productRepository.updateOrder(orderId, order);
  }

  async itemsTotal(items: Items): Promise<number> {
    let total: number = 0;
    for (const item of items) {
      const product = await this.productRepository.findProductById(
        item.productId,
      );
      total += product.price * item.quantity;
    }
    return total;
  }

  @OnEvent('payment success')
  async watchOrderStatus(orderId: string): Promise<Observable<string>> {
    // impmentating away to watch order status using mongodb replica set
    // const changeStreams = this.orderModel.watch([
    //   {
    //     $match: {
    //       'documentKey._id': orderId,
    //     },
    //   },
    // ]);

    // const changeStreams = this.productRepository.watchOrderStatus(orderId);
    const changeStream = await this.productRepository.findOrderById(orderId);
    return new Observable<string>((subscriber) => {
      // changeStream.on('change', (data) => {
      //   subscriber.next(data.status);
      // });
      subscriber.next(changeStream.status);

      // Clean up the event listener when the subscriber unsubscribes
      return () => {
        // changeStream.close().catch((error) => {
        //   subscriber.error(error);
        // });
        subscriber.complete();
        subscriber.unsubscribe();
      };
    });
  }
}
