import { ObjectType, Field, InputType, Float } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  Length,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import {
  JointRun,
  JointRunParticipant,
  User,
  RunnerCard,
} from '@prisma/client';
import { UserProfileType } from '../../users/dto/user-profile.dto';
import { RunnerCardType } from '../../runner-cards/dto/runner-card.dto';

export enum JointRunParticipantStatus {
  INTERESTED = 'INTERESTED',
  GOING = 'GOING',
  COMPLETED = 'COMPLETED',
}

@ObjectType()
export class JointRunType implements JointRun {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field()
  dateTime: Date;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => Float, { nullable: true })
  latitude: number | null;

  @Field(() => Float, { nullable: true })
  longitude: number | null;

  @Field()
  createdById: string;

  @Field(() => UserProfileType, { nullable: true })
  createdBy: UserProfileType | null; // Populated relation

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [JointRunParticipantType], { nullable: true })
  participants: JointRunParticipantType[] | null; // Populated relation
}

@InputType()
export class CreateJointRunInput {
  @Field()
  @IsString()
  @Length(1, 100)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @Field()
  @IsDate()
  dateTime: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  location?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

@InputType()
export class UpdateJointRunInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  dateTime?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  location?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

@ObjectType()
export class JointRunParticipantType implements JointRunParticipant {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => UserProfileType, { nullable: true })
  user: UserProfileType | null; // Populated relation

  @Field()
  jointRunId: string;

  @Field(() => JointRunType, { nullable: true })
  jointRun: JointRunType | null; // Populated relation

  @Field(() => String, { nullable: true })
  runnerCardId: string | null;

  @Field(() => RunnerCardType, { nullable: true })
  runnerCard: RunnerCardType | null; // Populated relation

  @Field()
  joinedAt: Date;

  @Field(() => String)
  @IsEnum(JointRunParticipantStatus)
  status: string;
}

@InputType()
export class JoinRunInput {
  @Field()
  @IsString()
  jointRunId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  runnerCardId?: string;

  @Field(() => String, { defaultValue: JointRunParticipantStatus.INTERESTED })
  @IsOptional()
  @IsEnum(JointRunParticipantStatus)
  status?: JointRunParticipantStatus;
}
