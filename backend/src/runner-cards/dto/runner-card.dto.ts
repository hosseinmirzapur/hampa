import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, Length, IsUrl } from 'class-validator';
import { RunnerCard } from '@prisma/client';

@ObjectType()
export class RunnerCardType implements RunnerCard {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  imageUrl: string | null;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateRunnerCardInput {
  @Field()
  @IsString()
  @Length(1, 100)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

@InputType()
export class UpdateRunnerCardInput {
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
  @IsUrl()
  imageUrl?: string;
}
