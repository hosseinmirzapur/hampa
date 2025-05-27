import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RunnerCardsService } from './runner-cards.service';
import { RunnerCardType, CreateRunnerCardInput, UpdateRunnerCardInput } from './dto/runner-card.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => RunnerCardType)
export class RunnerCardsResolver {
  constructor(private readonly runnerCardsService: RunnerCardsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RunnerCardType)
  async createRunnerCard(
    @CurrentUser() user: User,
    @Args('createRunnerCardInput') createRunnerCardInput: CreateRunnerCardInput,
  ): Promise<RunnerCardType> {
    return this.runnerCardsService.create(user.id, createRunnerCardInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [RunnerCardType], { name: 'myRunnerCards' })
  async getMyRunnerCards(@CurrentUser() user: User): Promise<RunnerCardType[]> {
    return this.runnerCardsService.findAllByUser(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => RunnerCardType, { name: 'runnerCard' })
  async getRunnerCard(@Args('id') id: string): Promise<RunnerCardType> {
    return this.runnerCardsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RunnerCardType)
  async updateRunnerCard(
    @CurrentUser() user: User,
    @Args('id') id: string,
    @Args('updateRunnerCardInput') updateRunnerCardInput: UpdateRunnerCardInput,
  ): Promise<RunnerCardType> {
    return this.runnerCardsService.update(id, user.id, updateRunnerCardInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RunnerCardType)
  async deleteRunnerCard(
    @CurrentUser() user: User,
    @Args('id') id: string,
  ): Promise<RunnerCardType> {
    return this.runnerCardsService.remove(id, user.id);
  }

  @Query(() => [RunnerCardType], { name: 'allRunnerCards' })
  async getAllRunnerCards(): Promise<RunnerCardType[]> {
    return this.runnerCardsService.findAll();
  }
}