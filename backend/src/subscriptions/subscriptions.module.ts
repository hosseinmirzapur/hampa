import { Module } from '@nestjs/common';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  providers: [SubscriptionsResolver, SubscriptionsService]
})
export class SubscriptionsModule {}
