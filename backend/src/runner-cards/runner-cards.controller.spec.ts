import { Test, TestingModule } from '@nestjs/testing';
import { RunnerCardsController } from './runner-cards.controller';

describe('RunnerCardsController', () => {
  let controller: RunnerCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunnerCardsController],
    }).compile();

    controller = module.get<RunnerCardsController>(RunnerCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
