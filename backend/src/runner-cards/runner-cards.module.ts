import { Module } from '@nestjs/common';
import { RunnerCardsResolver } from './runner-cards.resolver';
import { RunnerCardsService } from './runner-cards.service';

@Module({
  providers: [RunnerCardsResolver, RunnerCardsService]
})
export class RunnerCardsModule {}
