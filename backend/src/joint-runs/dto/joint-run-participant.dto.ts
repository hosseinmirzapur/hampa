import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '../../users/dto/user-profile.dto'; // Assuming UserProfileDto is suitable for user
import { RunnerCardDto } from '../../runner-cards/dto/runner-card.dto'; // Assuming RunnerCardDto is suitable for runnerCard

export class JointRunParticipantDto {
  @ApiProperty({ description: 'Unique identifier of the participant entry' })
  id: string;

  @ApiProperty({ description: 'Unique identifier of the user participating' })
  userId: string;

  @ApiProperty({
    description: 'User participating in the run',
    type: UserProfileDto,
  })
  user: UserProfileDto;

  @ApiProperty({ description: 'Unique identifier of the joint run' })
  jointRunId: string;

  // Note: JointRunDto is not included here to avoid circular dependency

  @ApiProperty({
    description: 'Unique identifier of the runner card used (optional)',
    required: false,
  })
  runnerCardId?: string;

  @ApiProperty({
    description: 'Runner card used for the run (optional)',
    type: RunnerCardDto,
    required: false,
  })
  runnerCard?: RunnerCardDto;

  @ApiProperty({ description: 'Timestamp when the user joined the run' })
  joinedAt: Date;

  @ApiProperty({
    description:
      'Status of the participant (e.g., INTERESTED, GOING, COMPLETED)',
  })
  status: string;
}
