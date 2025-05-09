import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinRunDto {
  @ApiProperty({
    description: 'Optional ID of the runner card to use for this participation',
    required: false,
  })
  @IsOptional()
  @IsString()
  runnerCardId?: string;
}
