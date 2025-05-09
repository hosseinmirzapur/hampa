import { Module } from '@nestjs/common';
import { JointRunsService } from './joint-runs/joint-runs.service';
import { JointRunsController } from './joint-runs/joint-runs.controller';

@Module({
  providers: [JointRunsService],
  controllers: [JointRunsController]
})
export class JointRunsModule {}
