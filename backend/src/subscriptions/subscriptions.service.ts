import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription } from '@prisma/client'; // Import Subscription type from Prisma

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async findUserSubscription(userId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    // It's okay if a user doesn't have a subscription, so we don't throw NotFoundException here.
    // The controller can decide how to handle a null response.
    return subscription;
  }

  // TODO: Implement methods for creating/updating subscriptions (likely involving payment gateway integration)
}
