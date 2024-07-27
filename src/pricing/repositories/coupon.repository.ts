import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../common/database/base-repository';
import { Coupon } from '../entities/coupon.entity';

@Injectable()
export class CouponRepository extends BaseRepository<Coupon> {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {
    super(couponModel);
  }
}
