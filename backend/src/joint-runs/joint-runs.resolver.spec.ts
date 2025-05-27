import { Test, TestingModule } from '@nestjs/testing';
import { JointRunsResolver } from './joint-runs.resolver';

describe('JointRunsResolver', () => {
  let resolver: JointRunsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JointRunsResolver],
    }).compile();

    resolver = module.get<JointRunsResolver>(JointRunsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
