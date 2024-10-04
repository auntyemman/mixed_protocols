import { Module } from '@nestjs/common';
import { DataStreamsService } from './data-streams.service';
import { DataStreamsController } from './data-streams.controller';

@Module({
  controllers: [DataStreamsController],
  providers: [DataStreamsService],
})
export class DataStreamsModule {}
