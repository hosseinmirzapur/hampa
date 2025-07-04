import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JointRunsService } from './joint-runs.service';
import {
  JointRunType,
  CreateJointRunInput,
  UpdateJointRunInput,
  JoinRunInput,
  JointRunParticipantType,
} from './dto/joint-run.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserProfileType } from '../users/dto/user-profile.dto';

@Resolver(() => JointRunType)
export class JointRunsResolver {
  constructor(private readonly jointRunsService: JointRunsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => JointRunType)
  async createJointRun(
    @CurrentUser() user: UserProfileType,
    @Args('createJointRunInput') createJointRunInput: CreateJointRunInput,
  ): Promise<JointRunType> {
    return this.jointRunsService.create(user.id, createJointRunInput);
  }

  @Query(() => [JointRunType], { name: 'allJointRuns' })
  async getAllJointRuns(): Promise<JointRunType[]> {
    return this.jointRunsService.findAll();
  }

  @Query(() => JointRunType, { name: 'jointRun', nullable: true })
  async getJointRun(@Args('id') id: string): Promise<JointRunType | null> {
    return this.jointRunsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => JointRunType)
  async updateJointRun(
    @CurrentUser() user: UserProfileType,
    @Args('id') id: string,
    @Args('updateJointRunInput') updateJointRunInput: UpdateJointRunInput,
  ): Promise<JointRunType> {
    return this.jointRunsService.update(id, user.id, updateJointRunInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => JointRunType)
  async deleteJointRun(
    @CurrentUser() user: UserProfileType,
    @Args('id') id: string,
  ): Promise<JointRunType> {
    return this.jointRunsService.remove(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => JointRunParticipantType)
  async joinRun(
    @CurrentUser() user: UserProfileType,
    @Args('joinRunInput') joinRunInput: JoinRunInput,
  ): Promise<JointRunParticipantType> {
    return this.jointRunsService.joinRun(user.id, joinRunInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => JointRunParticipantType)
  async leaveRun(
    @CurrentUser() user: UserProfileType,
    @Args('jointRunId') jointRunId: string,
  ): Promise<JointRunParticipantType> {
    return this.jointRunsService.leaveRun(user.id, jointRunId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [JointRunType], { name: 'myOrganizedRuns' })
  async getMyOrganizedRuns(
    @CurrentUser() user: UserProfileType,
  ): Promise<JointRunType[]> {
    return this.jointRunsService.findMyOrganizedRuns(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [JointRunParticipantType], { name: 'myJoinedRuns' })
  async getMyJoinedRuns(
    @CurrentUser() user: UserProfileType,
  ): Promise<JointRunParticipantType[]> {
    return this.jointRunsService.findMyJoinedRuns(user.id);
  }
}
