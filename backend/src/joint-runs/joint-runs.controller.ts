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
import { JointRunsService } from './joint-runs.service';
import { CreateJointRunDto } from './dto/create-joint-run.dto';
import { UpdateJointRunDto } from './dto/update-joint-run.dto';
import { JoinRunDto } from './dto/join-run.dto';
import { JointRunDto } from './dto/joint-run.dto';
import { JointRunParticipantDto } from './dto/joint-run-participant.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JointRun, JointRunParticipant } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager'; // Import CacheInterceptor

@ApiTags('joint-runs')
@Controller('joint-runs')
export class JointRunsController {
  constructor(private readonly jointRunsService: JointRunsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Create a new joint run for the authenticated user',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Joint run created successfully',
    type: JointRunDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Req() req,
    @Body() createJointRunDto: CreateJointRunDto,
  ): Promise<JointRun> {
    return this.jointRunsService.create(req.user.id, createJointRunDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor) // Apply caching to this endpoint
  @ApiOperation({ summary: 'Get all joint runs' })
  @ApiResponse({
    status: 200,
    description: 'List of all joint runs',
    type: [JointRunDto],
  })
  async findAll(): Promise<JointRun[]> {
    return this.jointRunsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a joint run by ID' })
  @ApiParam({ name: 'id', description: 'ID of the joint run to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Joint run found',
    type: JointRunDto,
  })
  @ApiResponse({ status: 404, description: 'Joint run not found' })
  async findOne(@Param('id') id: string): Promise<JointRun> {
    return this.jointRunsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a joint run by ID (requires ownership)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID of the joint run to update' })
  @ApiResponse({
    status: 200,
    description: 'Joint run updated successfully',
    type: JointRunDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (user does not own the run)',
  })
  @ApiResponse({ status: 404, description: 'Joint run not found' })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateJointRunDto: UpdateJointRunDto,
  ): Promise<JointRun> {
    return this.jointRunsService.update(id, req.user.id, updateJointRunDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a joint run by ID (requires ownership)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID of the joint run to delete' })
  @ApiResponse({
    status: 200,
    description: 'Joint run deleted successfully',
    type: JointRunDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (user does not own the run)',
  })
  @ApiResponse({ status: 404, description: 'Joint run not found' })
  async remove(@Req() req, @Param('id') id: string): Promise<JointRun> {
    return this.jointRunsService.remove(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/join')
  @ApiOperation({ summary: 'Join a joint run' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID of the joint run to join' })
  @ApiResponse({
    status: 201,
    description: 'Successfully joined the run',
    type: JointRunParticipantDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (e.g., already a participant, invalid runner card)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Joint run not found' })
  async joinRun(
    @Req() req,
    @Param('id') id: string,
    @Body() joinRunDto: JoinRunDto,
  ): Promise<JointRunParticipant> {
    return this.jointRunsService.joinRun(
      id,
      req.user.id,
      joinRunDto.runnerCardId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a joint run' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID of the joint run to leave' })
  @ApiResponse({
    status: 200,
    description: 'Successfully left the run',
    type: JointRunParticipantDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., not a participant)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Joint run not found' }) // Although service throws BadRequest, controller can return 404 if run not found
  async leaveRun(
    @Req() req,
    @Param('id') id: string,
  ): Promise<JointRunParticipant> {
    return this.jointRunsService.leaveRun(id, req.user.id);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get participants of a joint run' })
  @ApiParam({
    name: 'id',
    description: 'ID of the joint run to get participants for',
  })
  @ApiResponse({
    status: 200,
    description: 'List of participants',
    type: [JointRunParticipantDto],
  })
  @ApiResponse({ status: 404, description: 'Joint run not found' })
  async findRunParticipants(
    @Param('id') id: string,
  ): Promise<JointRunParticipant[]> {
    return this.jointRunsService.findRunParticipants(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/participations')
  @ApiOperation({
    summary: 'Get joint runs the authenticated user is participating in',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "List of user's joint run participations",
    type: [JointRunParticipantDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findUserParticipations(@Req() req): Promise<JointRunParticipant[]> {
    return this.jointRunsService.findUserParticipations(req.user.id);
  }
}
