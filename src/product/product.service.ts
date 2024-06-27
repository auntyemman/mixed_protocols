import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { CreateOrderDto } from './dto/order.dto';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.createProduct(createProductDto);
  }

  async addToCart(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, productId, quantity } = createCartDto;
    const cart = await this.productRepository.findCartById(userId);
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      const newCart = await this.productRepository.createCart({
        userId,
        items: [{ productId, quantity }],
      });
      return newCart;
    }
    return await this.productRepository.findCartById(userId);
  }

  async removeFromCart(updateCartDto: UpdateCartDto): Promise<Cart> {
    const { userId, productId } = updateCartDto;
    const cart = await this.productRepository.findCartById(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId,
    );
    const updatedCart = await this.productRepository.updateCart(userId, cart);
    return updatedCart;
  }

  async clearCart(userId: string): Promise<void> {
    await this.productRepository.deleteCart(userId);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.productRepository.createOrder(createOrderDto);
  }

  async findOrder(id: string): Promise<Order> {
    return await this.productRepository.findOrderById(id);
  }

  async allOrders(): Promise<Order[]> {
    return await this.productRepository.allOrders();
  }
}
