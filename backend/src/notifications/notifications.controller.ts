import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto'; // Import NotificationDto
import { Notification } from '@prisma/client'; // Keep Prisma type for service return types

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get notifications for the authenticated user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "List of authenticated user's notifications",
    type: [NotificationDto], // Use NotificationDto here
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findUserNotifications(@Req() req): Promise<Notification[]> {
    // The user object is attached to the request by the JwtStrategy
    return this.notificationsService.findAllForUser(req.user.id);
  }

  // TODO: Add endpoint to mark notifications as read
}
