import { Test, TestingModule } from '@nestjs/testing';
import { RunnerCardsResolver } from './runner-cards.resolver';

describe('RunnerCardsResolver', () => {
  let resolver: RunnerCardsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunnerCardsResolver],
    }).compile();

    resolver = module.get<RunnerCardsResolver>(RunnerCardsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
