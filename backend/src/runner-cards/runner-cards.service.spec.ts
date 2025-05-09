import { Test, TestingModule } from '@nestjs/testing';
import { RunnerCardsService } from './runner-cards.service';

describe('RunnerCardsService', () => {
  let service: RunnerCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunnerCardsService],
    }).compile();

    service = module.get<RunnerCardsService>(RunnerCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
