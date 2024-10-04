import { Test, TestingModule } from '@nestjs/testing';
import { DataStreamsService } from './data-streams.service';

describe('DataStreamsService', () => {
  let service: DataStreamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataStreamsService],
    }).compile();

    service = module.get<DataStreamsService>(DataStreamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
