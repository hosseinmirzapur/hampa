import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJointRunInput, UpdateJointRunInput, JoinRunInput, JointRunParticipantStatus } from './dto/joint-run.dto';
import { JointRun, JointRunParticipant } from '@prisma/client';

@Injectable()
export class JointRunsService {
  constructor(private prisma: PrismaService) {}

  async create(createdById: string, data: CreateJointRunInput): Promise<JointRun> {
    return this.prisma.jointRun.create({
      data: {
        ...data,
        createdById,
      },
    });
  }

  async findAll(): Promise<JointRun[]> {
    return this.prisma.jointRun.findMany({
      include: { createdBy: true, participants: { include: { user: true, runnerCard: true } } },
    });
  }

  async findOne(id: string): Promise<JointRun | null> {
    return this.prisma.jointRun.findUnique({
      where: { id },
      include: { createdBy: true, participants: { include: { user: true, runnerCard: true } } },
    });
  }

  async update(id: string, createdById: string, data: UpdateJointRunInput): Promise<JointRun> {
    const jointRun = await this.prisma.jointRun.findUnique({ where: { id } });
    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID ${id} not found.`);
    }
    if (jointRun.createdById !== createdById) {
      throw new UnauthorizedException('You are not authorized to update this joint run.');
    }
    return this.prisma.jointRun.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, createdById: string): Promise<JointRun> {
    const jointRun = await this.prisma.jointRun.findUnique({ where: { id } });
    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID ${id} not found.`);
    }
    if (jointRun.createdById !== createdById) {
      throw new UnauthorizedException('You are not authorized to delete this joint run.');
    }
    return this.prisma.jointRun.delete({ where: { id } });
  }

  async joinRun(userId: string, data: JoinRunInput): Promise<JointRunParticipant> {
    const { jointRunId, runnerCardId, status } = data;

    const jointRun = await this.prisma.jointRun.findUnique({ where: { id: jointRunId } });
    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID ${jointRunId} not found.`);
    }

    const existingParticipant = await this.prisma.jointRunParticipant.findUnique({
      where: { userId_jointRunId: { userId, jointRunId } },
    });

    if (existingParticipant) {
      throw new ConflictException('You have already joined this run.');
    }

    if (runnerCardId) {
      const runnerCard = await this.prisma.runnerCard.findUnique({ where: { id: runnerCardId } });
      if (!runnerCard || runnerCard.userId !== userId) {
        throw new UnauthorizedException('Invalid or unauthorized runner card.');
      }
    }

    return this.prisma.jointRunParticipant.create({
      data: {
        userId,
        jointRunId,
        runnerCardId,
        status: status || JointRunParticipantStatus.INTERESTED,
      },
      include: { user: true, jointRun: true, runnerCard: true },
    });
  }

  async leaveRun(userId: string, jointRunId: string): Promise<JointRunParticipant> {
    const participant = await this.prisma.jointRunParticipant.findUnique({
      where: { userId_jointRunId: { userId, jointRunId } },
    });

    if (!participant) {
      throw new NotFoundException('You are not a participant of this run.');
    }

    return this.prisma.jointRunParticipant.delete({
      where: { userId_jointRunId: { userId, jointRunId } },
      include: { user: true, jointRun: true, runnerCard: true },
    });
  }

  async findMyOrganizedRuns(userId: string): Promise<JointRun[]> {
    return this.prisma.jointRun.findMany({
      where: { createdById: userId },
      include: { createdBy: true, participants: { include: { user: true, runnerCard: true } } },
    });
  }

  async findMyJoinedRuns(userId: string): Promise<JointRunParticipant[]> {
    return this.prisma.jointRunParticipant.findMany({
      where: { userId },
      include: { user: true, jointRun: { include: { createdBy: true } }, runnerCard: true },
    });
  }
}