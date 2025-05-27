import { Module } from '@nestjs/common';
import { RunnerCardsService } from './runner-cards/runner-cards.service';
import { RunnerCardsController } from './runner-cards/runner-cards.controller';
import { RunnerCardsResolver } from './runner-cards.resolver';

@Module({
  providers: [RunnerCardsService, RunnerCardsResolver],
  controllers: [RunnerCardsController]
})
export class RunnerCardsModule {}
