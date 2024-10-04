import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  Model,
  ClientSession,
  Document,
  FilterQuery,
  UpdateQuery,
} from 'mongoose';

// Base repository with default transactions do the methods
export abstract class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  private async Transaction<R>(
    operations: (session: ClientSession) => Promise<R>,
  ): Promise<R> {
    const session: ClientSession = await this.model.db.startSession();
    session.startTransaction();

    try {
      const result: R = await operations(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const result = this.Transaction<T>(async (session: ClientSession) => {
      return await new this.model(data).save({ session });
    });
    if (!result) {
      throw new UnprocessableEntityException('Failed to create document');
    }
    return result;
  }

  async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T> {
    const result = this.Transaction<T>(async (session: ClientSession) => {
      return await this.model
        .findOneAndUpdate(filter, data, {
          session,
        })
        .exec();
    });
    if (!result) {
      throw new UnprocessableEntityException('Failed to update document');
    }
    return result;
  }

  async delete(filter: FilterQuery<T>): Promise<T> {
    const result = this.Transaction<T>(async (session: ClientSession) => {
      return await this.model
        .findOneAndDelete(filter, {
          session,
        })
        .exec();
    });
    if (!result) {
      throw new UnprocessableEntityException('Failed to delete document');
    }
    return result;
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    const result = this.Transaction<T>(async (session: ClientSession) => {
      return await this.model.findOne(filter, {}, { session }).exec();
    });
    if (!result) {
      throw new NotFoundException('Failed to find document');
    }
    return result;
  }
}
