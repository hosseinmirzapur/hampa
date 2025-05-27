import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Notification } from '@prisma/client';

@ObjectType()
export class NotificationType implements Notification {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field()
  message: string;

  @Field(() => String, { nullable: true })
  relatedEntityId: string | null;

  @Field(() => String, { nullable: true })
  relatedEntityType: string | null;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsString()
  userId: string; // The user to whom the notification is sent

  @Field()
  @IsString()
  type: string; // e.g., "NEW_JOINER", "RUN_REMINDER", "FRIEND_REQUEST"

  @Field()
  @IsString()
  message: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  relatedEntityId?: string; // e.g., JointRunId, UserId

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  relatedEntityType?: string; // e.g., "JointRun", "User"
}
