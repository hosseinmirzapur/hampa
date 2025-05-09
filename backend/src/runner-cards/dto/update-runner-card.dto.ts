import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRunnerCardDto {
  @ApiProperty({ description: 'Title of the runner card', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the runner card',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL to the runner card image', required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  // TODO: Add properties for specific runner card stats if needed
  // @ApiProperty({ description: 'Example stat', required: false })
  // @IsOptional()
  // @IsNumber()
  // exampleStat?: number;
}
