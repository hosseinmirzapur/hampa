import { Test, TestingModule } from '@nestjs/testing';
import { JointRunsController } from './joint-runs.controller';

describe('JointRunsController', () => {
  let controller: JointRunsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JointRunsController],
    }).compile();

    controller = module.get<JointRunsController>(JointRunsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
