import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './dto/notification.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => NotificationType)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [NotificationType], { name: 'myNotifications' })
  async getMyNotifications(@CurrentUser() user: User): Promise<NotificationType[]> {
    return this.notificationsService.findUserNotifications(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NotificationType)
  async markNotificationAsRead(
    @Args('notificationId') notificationId: string,
  ): Promise<NotificationType> {
    return this.notificationsService.markNotificationAsRead(notificationId);
  }
}