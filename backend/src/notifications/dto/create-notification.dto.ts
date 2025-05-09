import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Type of the notification (e.g., NEW_JOINER, RUN_REMINDER)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Content of the notification message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Optional ID of a related entity (e.g., JointRun ID)',
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedEntityId?: string;

  @ApiProperty({
    description: 'Optional type of the related entity (e.g., JointRun)',
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;
}
