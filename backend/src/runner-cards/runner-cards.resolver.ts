import { Resolver, Query, Mutation, Args, Field, InputType, ID, ObjectType, Context } from '@nestjs/graphql';
import { RunnerCardsService } from './runner-cards.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'; // Assuming you have a GqlAuthGuard
import { AuthenticatedUser } from '../auth/auth.service'; // Assuming AuthenticatedUser type
// Placeholder for the User type - to be defined later
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  phoneNumber: string;

  // Add other user fields as needed
}

@ObjectType()
export class RunnerCard {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => [String])
  days: string[];

  @Field()
  time: string;

  @Field()
  phoneNumber: string;

  @Field()
  isPhoneNumberPublic: boolean;

  @Field(() => User, { nullable: true })
  owner: User; // Assuming a card can have an owner
}

@InputType()
export class CreateRunnerCardInput {
  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => [String])
  days: string[];

  @Field()
  time: string;

  @Field()
  phoneNumber: string;

  @Field()
  isPhoneNumberPublic: boolean;
}

@InputType()
export class UpdateRunnerCardVisibilityInput {
 @Field(() => ID)
  id: string;

 @Field()
  isPhoneNumberPublic: boolean;
}

@InputType()
export class ExpressInterestInput {
 @Field(() => ID)
  cardId: string;
}
@Resolver(() => RunnerCard)
export class RunnerCardsResolver {
  constructor(private readonly runnerCardsService: RunnerCardsService) {}

  // Assuming you have an AuthGuard that adds user to the context
  // @UseGuards(AuthGuard('jwt')) 
  @Mutation(() => RunnerCard)
  async createRunnerCard(
    @Args('input') input: CreateRunnerCardInput,
    // In a real application, you would get the authenticated user from the context
    // For now, we'll use a placeholder user ID
    // @Context('req').user
  ): Promise<RunnerCard> {
    const userId = 'placeholder-user-id'; // Replace with logic to get authenticated user ID
    return this.runnerCardsService.create(userId, input);
  }

  @Query(() => RunnerCard, { nullable: true })
  async runnerCard(@Args('id', { type: () => ID }) id: string): Promise<RunnerCard | null> {
    // Placeholder logic - replace with actual service call
    console.log('Fetching runner card with ID:', id);
    // return this.runnerCardsService.findOne(id);
    return this.runnerCardsService.findOne(id);
  }

  @Query(() => [RunnerCard])
  async runnerCards(): Promise<RunnerCard[]> {
    return this.runnerCardsService.findAll();
  }

  @Mutation(() => RunnerCard)
  async expressInterest(
    @Args('input') input: ExpressInterestInput,
    @Context('req') req: any // Assuming user is attached to req
  ): Promise<RunnerCard> {
    const userId = req.user.id; // Get authenticated user ID from context
    return this.runnerCardsService.expressInterest(input.cardId, userId);
  }

  @Mutation(() => RunnerCard)
  async deleteCard(
    @Args('id', { type: () => ID }) id: string,
    // @Context('req').user
  ): Promise<RunnerCard> {
    const userId = 'placeholder-user-id'; // TODO: Replace with logic to get authenticated user ID
    return this.runnerCardsService.remove(id, userId);
  }

  @Mutation(() => RunnerCard)
  async updateCardVisibility(
    @Args('input') input: UpdateRunnerCardVisibilityInput,
    @Context('req') req: any // Assuming user is attached to req
  ): Promise<RunnerCard> {
    const userId = req.user.id; // Get authenticated user ID from context
    return this.runnerCardsService.updateVisibility(input.id, input.isPhoneNumberPublic, userId);
  }
}