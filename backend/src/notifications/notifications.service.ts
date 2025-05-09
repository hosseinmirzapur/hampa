import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from '@prisma/client'; // Import Notification type from Prisma

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        userId: userId, // Link the notification to the user
      },
    });
  }

  async findAllForUser(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc', // Order by most recent
      },
    });
  }

  // TODO: Implement method to mark notifications as read
}
