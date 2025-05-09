import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '../../users/dto/user-profile.dto'; // Assuming UserProfileDto is suitable for createdBy
import { JointRunParticipantDto } from './joint-run-participant.dto'; // Forward declaration

export class JointRunDto {
  @ApiProperty({ description: 'Unique identifier of the joint run' })
  id: string;

  @ApiProperty({ description: 'Title of the joint run' })
  title: string;

  @ApiProperty({ description: 'Description of the joint run', required: false })
  description?: string;

  @ApiProperty({ description: 'Date and time of the joint run' })
  dateTime: Date;

  @ApiProperty({ description: 'Location of the joint run', required: false })
  location?: string;

  @ApiProperty({
    description: 'Latitude of the joint run location',
    required: false,
  })
  latitude?: number;

  @ApiProperty({
    description: 'Longitude of the joint run location',
    required: false,
  })
  longitude?: number;

  @ApiProperty({
    description: 'Unique identifier of the user who created the run',
  })
  createdById: string;

  @ApiProperty({
    description: 'User who created the run',
    type: UserProfileDto,
  })
  createdBy: UserProfileDto;

  @ApiProperty({
    description: 'List of participants in the run',
    type: [JointRunParticipantDto],
  })
  participants: JointRunParticipantDto[];

  @ApiProperty({ description: 'Timestamp when the joint run was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the joint run was last updated' })
  updatedAt: Date;
}
