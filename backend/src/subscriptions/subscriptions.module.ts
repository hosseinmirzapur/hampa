import { Module } from '@nestjs/common';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionsResolver, SubscriptionsService],
})
export class SubscriptionsModule {}
