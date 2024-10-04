import { Test, TestingModule } from '@nestjs/testing';
import { DataStreamsController } from './data-streams.controller';
import { DataStreamsService } from './data-streams.service';

describe('DataStreamsController', () => {
  let controller: DataStreamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataStreamsController],
      providers: [DataStreamsService],
    }).compile();

    controller = module.get<DataStreamsController>(DataStreamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
