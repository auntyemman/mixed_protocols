import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createProduct(product: CreateProductDto): Promise<Product> {
    const createdProduct = await this.productModel.create(product);
    if (!createdProduct) {
      throw new Error('Failed to create product');
    }
    return createdProduct;
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

  async findOrderById(id: string): Promise<Order> {
    return await this.orderModel.findOne({ _id: id });
  }

  async allOrders(): Promise<Order[]> {
    return await this.orderModel.find();
  }
}
