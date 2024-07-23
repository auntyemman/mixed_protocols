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
import { map } from 'rxjs/operators';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AbacGuard } from 'src/common/guards/abac.gaurd';
import { Attributes } from 'src/common/decorators/attributes.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permission.dedcorator';
import { RolesGuard } from 'src/common/guards/rbac.gaurd';
import { PermissionsGuard } from 'src/common/guards/pbac.guard';
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Attributes({ email: 'jibola4@gmail.com' }, { lastName: 'Paso' })
  @UseGuards(AbacGuard)
  @Post('/create')
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/cart/add')
  async addToCart(@Body() createCartDto: CreateCartDto) {
    return await this.productService.addToCart(createCartDto);
  }

  @Permissions('able_to_remove')
  @UseGuards(PermissionsGuard)
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

  @OnEvent('order status')
  // @Sse(':id/statuss')
  @Get(':id/statuss')
  async orderStatusEevnt(@Param('id') id: string): Promise<any> {
    const order = await this.productService.findOrder(id);
    return {
      data: order.status,
    };
  }

  @Sse(':id/status')
  async orderStatus(@Param('id') id: string): Promise<Observable<string>> {
    return await this.productService.watchOrderStatus(id);
      // .pipe(map((data) => ({ data }))) as Observable<MessageEvent>;
  }

}
