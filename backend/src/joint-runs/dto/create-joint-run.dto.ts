import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJointRunDto {
  @ApiProperty({ description: 'Title of the joint run' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the joint run', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Date and time of the joint run (ISO 8601 format)',
  })
  @IsDateString()
  dateTime: string;

  @ApiProperty({ description: 'Location of the joint run', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Latitude of the joint run location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude of the joint run location',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;
}
