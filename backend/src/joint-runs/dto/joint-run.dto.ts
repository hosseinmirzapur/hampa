import { ObjectType, Field, InputType, Float } from '@nestjs/graphql';
import { IsString, IsOptional, Length, IsDate, IsNumber, IsEnum } from 'class-validator';
import { JointRun, JointRunParticipant, User, RunnerCard } from '@prisma/client';
import { UserProfileType } from '../../src/users/dto/user-profile.dto';
import { RunnerCardType } from '../../src/runner-cards/dto/runner-card.dto';

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

  @Field({ nullable: true })
  description?: string;

  @Field()
  dateTime: Date;

  @Field({ nullable: true })
  location?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field()
  createdById: string;

  @Field(() => UserProfileType)
  createdBy: User; // Populated relation

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [JointRunParticipantType])
  participants?: JointRunParticipant[]; // Populated relation
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

  @Field(() => UserProfileType)
  user: User; // Populated relation

  @Field()
  jointRunId: string;

  @Field(() => JointRunType)
  jointRun: JointRun; // Populated relation

  @Field({ nullable: true })
  runnerCardId?: string;

  @Field(() => RunnerCardType, { nullable: true })
  runnerCard?: RunnerCard; // Populated relation

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
