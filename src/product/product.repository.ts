import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Order, OrderDocument } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { CreateOrderDto } from './dto/order.dto';

export interface ChangeStream {
  on(event: 'change', listener: (doc: any) => void): this;
  close(): Promise<void>;
}
@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createProduct(product: CreateProductDto): Promise<Product> {
    const createdProduct = await this.productModel.create(product);
    if (!createdProduct) {
      throw new Error('Failed to create product');
    }
    return createdProduct;
  }

  async findProductById(id: string): Promise<Product> {
    return await this.productModel.findOne({ _id: id });
  }

  async createCart(cart: any): Promise<Cart> {
    const createdCart = await this.cartModel.create(cart);
    if (!createdCart) {
      throw new Error('Failed to create cart');
    }
    return createdCart;
  }

  async findCartById(id: string): Promise<Cart> {
    return await this.cartModel.findOne({ _id: id });
  }

  async updateCart(id: string, cart: any): Promise<Cart> {
    return await this.cartModel.findOneAndUpdate({ _id: id }, cart, {
      new: true,
    });
  }

  async deleteCart(id: string): Promise<Cart> {
    return await this.cartModel.findOneAndDelete({ _id: id });
  }

  async createOrder(order: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.orderModel.create(order);
    if (!createdOrder) {
      throw new Error('Failed to create order');
    }
    return createdOrder;
  }

  async updateOrder(id: string, order: any): Promise<Order> {
    return await this.orderModel.findOneAndUpdate({ _id: id }, order, {
      new: true,
    });
  }

  watchOrderStatus(orderId: string): ChangeStream {
    const order: ChangeStream = this.orderModel.watch([
      {
        $match: {
          'documentKey._id': orderId,
        },
      },
    ]);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async findOrderById(id: string): Promise<OrderDocument> {
    return await this.orderModel.findOne({ _id: id });
  }

  async allOrders(): Promise<Order[]> {
    return await this.orderModel.find();
  }
}
