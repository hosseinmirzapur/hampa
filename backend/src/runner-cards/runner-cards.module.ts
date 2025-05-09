import { Module } from '@nestjs/common';
import { RunnerCardsService } from './runner-cards/runner-cards.service';
import { RunnerCardsController } from './runner-cards/runner-cards.controller';

@Module({
  providers: [RunnerCardsService],
  controllers: [RunnerCardsController]
})
export class RunnerCardsModule {}
