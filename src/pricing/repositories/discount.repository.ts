import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../common/database/base-repository';
import { Discount } from '../entities/discount.entity';

@Injectable()
export class DiscountRepository extends BaseRepository<Discount> {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
  ) {
    super(discountModel);
  }
}
