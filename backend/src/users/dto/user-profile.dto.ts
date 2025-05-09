import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ description: "User's phone number" })
  phone: string;

  @ApiProperty({ description: "User's name", required: false })
  name?: string;

  @ApiProperty({ description: "User's email address", required: false })
  email?: string;

  @ApiProperty({
    description: "URL to the user's avatar image",
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({ description: "User's biography", required: false })
  bio?: string;

  @ApiProperty({ description: 'Timestamp when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the user was last updated' })
  updatedAt: Date;
}
