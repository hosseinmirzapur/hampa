import { Module } from '@nestjs/common';
import { RunnerCardsResolver } from './runner-cards.resolver';
import { RunnerCardsService } from './runner-cards.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RunnerCardsResolver, RunnerCardsService],
})
export class RunnerCardsModule {}
