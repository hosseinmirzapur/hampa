import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'; // Added ForbiddenException
import { PrismaService } from '../prisma/prisma.service';
import { CreateRunnerCardDto } from './dto/create-runner-card.dto';
import { UpdateRunnerCardDto } from './dto/update-runner-card.dto';
import { RunnerCard } from '@prisma/client'; // Import RunnerCard type from Prisma

@Injectable()
export class RunnerCardsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createRunnerCardDto: CreateRunnerCardDto,
  ): Promise<RunnerCard> {
    return this.prisma.runnerCard.create({
      data: {
        ...createRunnerCardDto,
        userId: userId, // Link the card to the authenticated user
      },
    });
  }

  async findAll(): Promise<RunnerCard[]> {
    return this.prisma.runnerCard.findMany();
  }

  async findOne(id: string): Promise<RunnerCard> {
    const runnerCard = await this.prisma.runnerCard.findUnique({
      where: { id },
    });

    if (!runnerCard) {
      throw new NotFoundException(`RunnerCard with ID "${id}" not found`);
    }

    return runnerCard;
  }

  async update(
    id: string,
    userId: string, // Added userId parameter
    updateRunnerCardDto: UpdateRunnerCardDto,
  ): Promise<RunnerCard> {
    // Check if runner card exists and belongs to the user
    const runnerCard = await this.findOne(id);
    if (runnerCard.userId !== userId) {
      throw new ForbiddenException('You do not own this runner card');
    }

    return this.prisma.runnerCard.update({
      where: { id },
      data: updateRunnerCardDto,
    });
  }

  async remove(id: string, userId: string): Promise<RunnerCard> {
    // Added userId parameter
    // Check if runner card exists and belongs to the user
    const runnerCard = await this.findOne(id);
    if (runnerCard.userId !== userId) {
      throw new ForbiddenException('You do not own this runner card');
    }

    return this.prisma.runnerCard.delete({ where: { id } });
  }

  async findUserCards(userId: string): Promise<RunnerCard[]> {
    return this.prisma.runnerCard.findMany({
      where: { userId },
    });
  }

  async expressInterest(cardId: string, userId: string): Promise<RunnerCard> {
    // Check if runner card exists
    const runnerCard = await this.findOne(cardId);

    // Check if the user has already expressed interest
    // Assuming a many-to-many relationship 'interestedUsers' in Prisma schema
    const hasExpressed = await this.prisma.runnerCard.findFirst({
      where: {
        id: cardId,
        interestedUsers: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (hasExpressed) {
      // User has already expressed interest, maybe throw an error or just return the card
      // For now, let's just return the existing card
      return runnerCard;
    }

    // Add the user to the interestedUsers list
    return this.prisma.runnerCard.update({
      where: { id: cardId },
      data: { interestedUsers: { connect: { id: userId } } },
    });
  }
}
