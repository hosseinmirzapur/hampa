import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJointRunDto } from './dto/create-joint-run.dto';
import { UpdateJointRunDto } from './dto/update-joint-run.dto';
import { JointRun, JointRunParticipant } from '@prisma/client'; // Import Prisma types

@Injectable()
export class JointRunsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createJointRunDto: CreateJointRunDto,
  ): Promise<JointRun> {
    // Convert dateTime string to Date object
    const dateTime = new Date(createJointRunDto.dateTime);

    return this.prisma.jointRun.create({
      data: {
        ...createJointRunDto,
        dateTime: dateTime,
        createdById: userId, // Link the run to the creating user
      },
    });
  }

  async findAll(): Promise<JointRun[]> {
    return this.prisma.jointRun.findMany({
      include: {
        createdBy: {
          select: { id: true, name: true, avatarUrl: true }, // Select relevant user fields
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
            runnerCard: {
              select: { id: true, title: true, imageUrl: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<JointRun> {
    const jointRun = await this.prisma.jointRun.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, avatarUrl: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
            runnerCard: {
              select: { id: true, title: true, imageUrl: true },
            },
          },
        },
      },
    });

    if (!jointRun) {
      throw new NotFoundException(`JointRun with ID "${id}" not found`);
    }

    return jointRun;
  }

  async update(
    id: string,
    userId: string, // User performing the update
    updateJointRunDto: UpdateJointRunDto,
  ): Promise<JointRun> {
    // Check if joint run exists and belongs to the user
    const jointRun = await this.findOne(id);
    if (jointRun.createdById !== userId) {
      throw new ForbiddenException('You do not own this joint run');
    }

    // Convert dateTime string to Date object if provided
    const updateData: any = { ...updateJointRunDto };
    if (updateJointRunDto.dateTime) {
      updateData.dateTime = new Date(updateJointRunDto.dateTime);
    }

    return this.prisma.jointRun.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string): Promise<JointRun> {
    // Check if joint run exists and belongs to the user
    const jointRun = await this.findOne(id);
    if (jointRun.createdById !== userId) {
      throw new ForbiddenException('You do not own this joint run');
    }

    return this.prisma.jointRun.delete({ where: { id } });
  }

  async joinRun(
    runId: string,
    userId: string,
    runnerCardId?: string,
  ): Promise<JointRunParticipant> {
    // Check if the run exists
    await this.findOne(runId);

    // Check if the user is already a participant
    const existingParticipant =
      await this.prisma.jointRunParticipant.findUnique({
        where: {
          userId_jointRunId: {
            userId: userId,
            jointRunId: runId,
          },
        },
      });

    if (existingParticipant) {
      throw new BadRequestException(
        'User is already a participant in this run',
      );
    }

    // Check if the runner card exists and belongs to the user if provided
    if (runnerCardId) {
      const runnerCard = await this.prisma.runnerCard.findUnique({
        where: { id: runnerCardId },
      });
      if (!runnerCard || runnerCard.userId !== userId) {
        throw new BadRequestException(
          'Invalid runner card or you do not own it',
        );
      }
    }

    return this.prisma.jointRunParticipant.create({
      data: {
        jointRunId: runId,
        userId: userId,
        runnerCardId: runnerCardId,
        status: 'GOING', // Default status
      },
    });
  }

  async leaveRun(runId: string, userId: string): Promise<JointRunParticipant> {
    // Check if the user is a participant in this run
    const participant = await this.prisma.jointRunParticipant.findUnique({
      where: {
        userId_jointRunId: {
          userId: userId,
          jointRunId: runId,
        },
      },
    });

    if (!participant) {
      throw new BadRequestException('User is not a participant in this run');
    }

    return this.prisma.jointRunParticipant.delete({
      where: { id: participant.id },
    });
  }

  async findRunParticipants(runId: string): Promise<JointRunParticipant[]> {
    // Check if the run exists
    await this.findOne(runId);

    return this.prisma.jointRunParticipant.findMany({
      where: { jointRunId: runId },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
        runnerCard: {
          select: { id: true, title: true, imageUrl: true },
        },
      },
    });
  }

  async findUserParticipations(userId: string): Promise<JointRunParticipant[]> {
    return this.prisma.jointRunParticipant.findMany({
      where: { userId },
      include: {
        jointRun: {
          include: {
            createdBy: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        runnerCard: {
          select: { id: true, title: true, imageUrl: true },
        },
      },
    });
  }
}
