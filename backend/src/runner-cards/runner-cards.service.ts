import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRunnerCardInput,
  UpdateRunnerCardInput,
} from './dto/runner-card.dto';
import { RunnerCard } from '@prisma/client';

@Injectable()
export class RunnerCardsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateRunnerCardInput,
  ): Promise<RunnerCard> {
    const transformedData = {
      ...data,
      isPhoneNumberPublic: Boolean(data.isPhoneNumberPublic),
    };
    return this.prisma.runnerCard.create({
      data: {
        ...transformedData,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<RunnerCard[]> {
    return this.prisma.runnerCard.findMany({
      where: { userId },
    });
  }

  async findOne(id: string): Promise<RunnerCard | null> {
    return this.prisma.runnerCard.findUnique({ where: { id } });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateRunnerCardInput,
  ): Promise<RunnerCard> {
    const card = await this.prisma.runnerCard.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException(`RunnerCard with ID ${id} not found.`);
    }
    if (card.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this runner card.',
      );
    }
    return this.prisma.runnerCard.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<RunnerCard> {
    const card = await this.prisma.runnerCard.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException(`RunnerCard with ID ${id} not found.`);
    }
    if (card.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this runner card.',
      );
    }
    return this.prisma.runnerCard.delete({ where: { id } });
  }

  async findAll(): Promise<RunnerCard[]> {
    return this.prisma.runnerCard.findMany();
  }
}
