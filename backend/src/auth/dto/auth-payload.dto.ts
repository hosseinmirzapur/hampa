import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: User;
}

@ObjectType()
export class UserType implements User {
    @Field()
    id: string;

    @Field()
    phone: string;

    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    avatarUrl?: string;

    @Field({ nullable: true })
    bio?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}