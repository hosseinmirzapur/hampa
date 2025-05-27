import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateJointRunInput,
  UpdateJointRunInput,
  JoinRunInput,
  JointRunParticipantStatus,
  JointRunType,
  JointRunParticipantType,
} from './dto/joint-run.dto';
import {
  JointRun,
  JointRunParticipant,
  User,
  RunnerCard,
} from '@prisma/client';
import { UserProfileType } from '../users/dto/user-profile.dto';
import { RunnerCardType } from '../runner-cards/dto/runner-card.dto';

@Injectable()
export class JointRunsService {
  constructor(private prisma: PrismaService) {}

  private _mapUserToUserProfileType(user: User): UserProfileType {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      bio: user.bio ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private _mapRunnerCardToRunnerCardType(
    runnerCard: RunnerCard,
  ): RunnerCardType {
    return {
      id: runnerCard.id,
      title: runnerCard.title,
      description: runnerCard.description ?? null,
      imageUrl: runnerCard.imageUrl ?? null, // Added imageUrl mapping
      userId: runnerCard.userId,
      createdAt: runnerCard.createdAt,
      updatedAt: runnerCard.updatedAt,
    };
  }

  private _mapJointRunParticipantToJointRunParticipantType(
    participant: JointRunParticipant & {
      user: User | null;
      jointRun: JointRun | null;
      runnerCard: RunnerCard | null;
    },
  ): JointRunParticipantType {
    return {
      id: participant.id,
      userId: participant.userId,
      user: participant.user
        ? this._mapUserToUserProfileType(participant.user)
        : null,
      jointRunId: participant.jointRunId,
      jointRun: participant.jointRun
        ? this._mapJointRunToJointRunType(participant.jointRun)
        : null,
      runnerCardId: participant.runnerCardId ?? null,
      runnerCard: participant.runnerCard
        ? this._mapRunnerCardToRunnerCardType(participant.runnerCard)
        : null,
      joinedAt: participant.joinedAt,
      status: participant.status,
    };
  }

  private _mapJointRunToJointRunType(
    jointRun: JointRun, // Accept base JointRun type
  ): JointRunType {
    // Cast internally to the augmented type for safe access to relations
    const augmentedJointRun = jointRun as JointRun & {
      createdBy: User | null;
      participants:
        | (JointRunParticipant & {
            user: User | null;
            runnerCard: RunnerCard | null;
            jointRun: JointRun | null;
          })[]
        | null;
    };

    return {
      id: augmentedJointRun.id,
      title: augmentedJointRun.title,
      description: augmentedJointRun.description ?? null,
      dateTime: augmentedJointRun.dateTime,
      location: augmentedJointRun.location ?? null,
      latitude: augmentedJointRun.latitude ?? null,
      longitude: augmentedJointRun.longitude ?? null,
      createdById: augmentedJointRun.createdById,
      createdBy: augmentedJointRun.createdBy
        ? this._mapUserToUserProfileType(augmentedJointRun.createdBy)
        : null,
      createdAt: augmentedJointRun.createdAt,
      updatedAt: augmentedJointRun.updatedAt,
      participants:
        augmentedJointRun.participants?.map((p) =>
          this._mapJointRunParticipantToJointRunParticipantType(p),
        ) ?? null,
    };
  }

  async create(
    createdById: string,
    data: CreateJointRunInput,
  ): Promise<JointRunType> {
    const newJointRun = await this.prisma.jointRun.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        createdBy: true,
        participants: {
          include: { user: true, runnerCard: true, jointRun: true },
        },
      },
    });
    return this._mapJointRunToJointRunType(newJointRun);
  }

  async findAll(): Promise<JointRunType[]> {
    const jointRuns = await this.prisma.jointRun.findMany({
      include: {
        createdBy: true,
        participants: {
          include: { user: true, runnerCard: true, jointRun: true },
        },
      },
    });
    return jointRuns.map(this._mapJointRunToJointRunType.bind(this));
  }

  async findOne(id: string): Promise<JointRunType | null> {
    const jointRun = await this.prisma.jointRun.findUnique({
      where: { id },
      include: {
        createdBy: true,
        participants: {
          include: { user: true, runnerCard: true, jointRun: true },
        },
      },
    });
    return jointRun ? this._mapJointRunToJointRunType(jointRun) : null;
  }

  async update(
    id: string,
    createdById: string,
    data: UpdateJointRunInput,
  ): Promise<JointRunType> {
    const jointRun = await this.prisma.jointRun.findUnique({ where: { id } });
    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID ${id} not found.`);
    }
    if (jointRun.createdById !== createdById) {
      throw new UnauthorizedException(
        'You are not authorized to update this joint run.',
      );
    }
    const updatedJointRun = await this.prisma.jointRun.update({
      where: { id },
      data,
      include: {
        createdBy: true,
        participants: {
          include: { user: true, runnerCard: true, jointRun: true },
        },
      },
    });
    return this._mapJointRunToJointRunType(updatedJointRun);
  }

  async remove(id: string, createdById: string): Promise<JointRunType> {
    const jointRun = await this.prisma.jointRun.findUnique({ where: { id } });
    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID ${id} not found.`);
    }
    if (jointRun.createdById !== createdById) {
      throw new UnauthorizedException(
        'You are not authorized to delete this joint run.',
      );
    }
    const deletedJointRun = await this.prisma.jointRun.delete({
      where: { id },
      include: {
        createdBy: true,
        participants: {
          include: { user: true, runnerCard: true, jointRun: true },
        },
      },
    });
    return this._mapJointRunToJointRunType(deletedJointRun);
  }

  async joinRun(
    userId: string,
    data: JoinRunInput,
  ): Promise<JointRunParticipantType> {
    const { jointRunId, runnerCardId, status } = data;

    const jointRun = await this.prisma.jointRun.findUnique({
      where: { id: jointRunId },
    });
    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID ${jointRunId} not found.`);
    }

    const existingParticipant =
      await this.prisma.jointRunParticipant.findUnique({
        where: { userId_jointRunId: { userId, jointRunId } },
      });

    if (existingParticipant) {
      throw new ConflictException('You have already joined this run.');
    }

    if (runnerCardId) {
      const runnerCard = await this.prisma.runnerCard.findUnique({
        where: { id: runnerCardId },
      });
      if (!runnerCard || runnerCard.userId !== userId) {
        throw new UnauthorizedException('Invalid or unauthorized runner card.');
      }
    }

    const newParticipant = await this.prisma.jointRunParticipant.create({
      data: {
        userId,
        jointRunId,
        runnerCardId,
        status: status || JointRunParticipantStatus.INTERESTED,
      },
      include: {
        user: true,
        jointRun: { include: { createdBy: true } },
        runnerCard: true,
      },
    });
    return this._mapJointRunParticipantToJointRunParticipantType(
      newParticipant,
    );
  }

  async leaveRun(
    userId: string,
    jointRunId: string,
  ): Promise<JointRunParticipantType> {
    const participant = await this.prisma.jointRunParticipant.findUnique({
      where: { userId_jointRunId: { userId, jointRunId } },
    });

    if (!participant) {
      throw new NotFoundException('You are not a participant of this run.');
    }

    const deletedParticipant = await this.prisma.jointRunParticipant.delete({
      where: { userId_jointRunId: { userId, jointRunId } },
      include: {
        user: true,
        jointRun: { include: { createdBy: true } },
        runnerCard: true,
      },
    });
    return this._mapJointRunParticipantToJointRunParticipantType(
      deletedParticipant,
    );
  }

  async findMyOrganizedRuns(userId: string): Promise<JointRunType[]> {
    const organizedRuns = await this.prisma.jointRun.findMany({
      where: { createdById: userId },
      include: {
        createdBy: true,
        participants: {
          include: { user: true, runnerCard: true, jointRun: true },
        },
      },
    });
    return organizedRuns.map(this._mapJointRunToJointRunType.bind(this));
  }

  async findMyJoinedRuns(userId: string): Promise<JointRunParticipantType[]> {
    const joinedRuns = await this.prisma.jointRunParticipant.findMany({
      where: { userId },
      include: {
        user: true,
        jointRun: { include: { createdBy: true } },
        runnerCard: true,
      },
    });
    return joinedRuns.map(
      this._mapJointRunParticipantToJointRunParticipantType.bind(this),
    );
  }
}
