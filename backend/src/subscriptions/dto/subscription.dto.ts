import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
  @ApiProperty({ description: 'Unique identifier of the subscription' })
  id: string;

  @ApiProperty({ description: 'Unique identifier of the user' })
  userId: string;

  @ApiProperty({
    description:
      'Identifier for the subscription plan (e.g., "basic", "premium")',
  })
  planId: string;

  @ApiProperty({
    description:
      'Status of the subscription (e.g., "ACTIVE", "CANCELED", "PAST_DUE")',
  })
  status: string;

  @ApiProperty({ description: 'Start date of the subscription' })
  startDate: Date;

  @ApiProperty({
    description:
      'End date of the subscription (nullable for ongoing subscriptions)',
    required: false,
    nullable: true,
  })
  endDate?: Date | null;

  @ApiProperty({
    description: 'Optional ID from the payment gateway for the subscription',
    required: false,
    nullable: true,
  })
  paymentGatewaySubscriptionId?: string | null;

  @ApiProperty({ description: 'Timestamp when the subscription was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the subscription was last updated',
  })
  updatedAt: Date;
}
