import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubscriptionDto } from './dto/subscription.dto'; // Import SubscriptionDto
import { Subscription } from '@prisma/client'; // Keep Prisma type for service return types

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: "Get authenticated user's subscription status" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Authenticated user's subscription status",
    type: SubscriptionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found for this user',
  })
  async findUserSubscription(@Req() req): Promise<Subscription> {
    // The user object is attached to the request by the JwtStrategy
    const subscription = await this.subscriptionsService.findUserSubscription(
      req.user.id,
    );
    if (!subscription) {
      throw new NotFoundException('Subscription not found for this user');
    }
    return subscription;
  }

  // TODO: Add endpoints for creating/managing subscriptions (will require payment gateway integration)
}
