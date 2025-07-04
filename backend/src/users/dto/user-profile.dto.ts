import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEmail, Length } from 'class-validator';
import { User } from '@prisma/client';

@ObjectType()
export class UserProfileType implements Partial<User> {
  @Field()
  id: string;

  @Field()
  phone: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Boolean, { defaultValue: false }) // Add hasSubscription
  hasSubscription: boolean;

  @Field(() => Date, { nullable: true }) // Add subscriptionExpiryDate
  subscriptionExpiryDate?: Date;
}

@InputType()
export class UpdateUserProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @Field(() => Boolean, { nullable: true }) // Add hasSubscription to input
  @IsOptional()
  hasSubscription?: boolean;

  @Field(() => Date, { nullable: true }) // Add subscriptionExpiryDate to input
  @IsOptional()
  subscriptionExpiryDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;
}
