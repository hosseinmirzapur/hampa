import { ApiProperty } from '@nestjs/swagger';

export class RunnerCardDto {
  @ApiProperty({ description: 'Unique identifier of the runner card' })
  id: string;

  @ApiProperty({ description: 'Title of the runner card' })
  title: string;

  @ApiProperty({
    description: 'Description of the runner card',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'URL to the runner card image', required: false })
  imageUrl?: string;

  @ApiProperty({
    description: 'Unique identifier of the user who owns the card',
  })
  userId: string;

  @ApiProperty({ description: 'Timestamp when the runner card was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the runner card was last updated',
  })
  updatedAt: Date;

  // TODO: Add properties for specific runner card stats if needed
  // @ApiProperty({ description: 'Example stat', required: false })
  // exampleStat?: number;
}
