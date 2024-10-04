import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/database/base-repository';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async findProducts(
    filter: FilterQuery<ProductDocument>,
  ): Promise<ProductDocument[]> {
    return await this.productModel.find(filter);
  }
}
