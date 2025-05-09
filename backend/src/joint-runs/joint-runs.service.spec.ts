import { Test, TestingModule } from '@nestjs/testing';
import { JointRunsService } from './joint-runs.service';

describe('JointRunsService', () => {
  let service: JointRunsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JointRunsService],
    }).compile();

    service = module.get<JointRunsService>(JointRunsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
