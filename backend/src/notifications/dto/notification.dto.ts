import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ description: 'Unique identifier of the notification' })
  id: string;

  @ApiProperty({
    description: 'Unique identifier of the user the notification is for',
  })
  userId: string;

  @ApiProperty({
    description: 'Type of the notification (e.g., NEW_JOINER, RUN_REMINDER)',
  })
  type: string;

  @ApiProperty({ description: 'Content of the notification message' })
  message: string;

  @ApiProperty({
    description: 'Optional ID of a related entity (e.g., JointRun ID)',
    required: false,
  })
  relatedEntityId?: string;

  @ApiProperty({
    description: 'Optional type of the related entity (e.g., JointRun)',
    required: false,
  })
  relatedEntityType?: string;

  @ApiProperty({ description: 'Whether the notification has been read' })
  isRead: boolean;

  @ApiProperty({ description: 'Timestamp when the notification was created' })
  createdAt: Date;
}
