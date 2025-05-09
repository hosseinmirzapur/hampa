import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors, // Import UseInterceptors
} from '@nestjs/common';
import { RunnerCardsService } from './runner-cards.service';
import { CreateRunnerCardDto } from './dto/create-runner-card.dto';
import { UpdateRunnerCardDto } from './dto/update-runner-card.dto';
import { RunnerCardDto } from './dto/runner-card.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { RunnerCard } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager'; // Import CacheInterceptor

@ApiTags('runner-cards')
@Controller('runner-cards')
export class RunnerCardsController {
  constructor(private readonly runnerCardsService: RunnerCardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Create a new runner card for the authenticated user',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Runner card created successfully',
    type: RunnerCardDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Req() req,
    @Body() createRunnerCardDto: CreateRunnerCardDto,
  ): Promise<RunnerCard> {
    return this.runnerCardsService.create(req.user.id, createRunnerCardDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor) // Apply caching to this endpoint
  @ApiOperation({ summary: 'Get all runner cards' })
  @ApiResponse({
    status: 200,
    description: 'List of all runner cards',
    type: [RunnerCardDto],
  })
  async findAll(): Promise<RunnerCard[]> {
    return this.runnerCardsService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get runner cards for the authenticated user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "List of authenticated user's runner cards",
    type: [RunnerCardDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findUserCards(@Req() req): Promise<RunnerCard[]> {
    return this.runnerCardsService.findUserCards(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a runner card by ID' })
  @ApiParam({ name: 'id', description: 'ID of the runner card to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Runner card found',
    type: RunnerCardDto,
  })
  @ApiResponse({ status: 404, description: 'Runner card not found' })
  async findOne(@Param('id') id: string): Promise<RunnerCard> {
    return this.runnerCardsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a runner card by ID (requires ownership)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID of the runner card to update' })
  @ApiResponse({
    status: 200,
    description: 'Runner card updated successfully',
    type: RunnerCardDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (user does not own the card)',
  })
  @ApiResponse({ status: 404, description: 'Runner card not found' })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateRunnerCardDto: UpdateRunnerCardDto,
  ): Promise<RunnerCard> {
    return this.runnerCardsService.update(id, req.user.id, updateRunnerCardDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a runner card by ID (requires ownership)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID of the runner card to delete' })
  @ApiResponse({
    status: 200,
    description: 'Runner card deleted successfully',
    type: RunnerCardDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (user does not own the card)',
  })
  @ApiResponse({ status: 404, description: 'Runner card not found' })
  async remove(@Req() req, @Param('id') id: string): Promise<RunnerCard> {
    return this.runnerCardsService.remove(id, req.user.id);
  }
}
