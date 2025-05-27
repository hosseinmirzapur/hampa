import { ObjectType, Field } from '@nestjs/graphql';
import { UserProfileType } from '../../users/dto/user-profile.dto';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => UserProfileType)
  user: UserProfileType;
}
