import { Module } from '@nestjs/common';
import { JointRunsResolver } from './joint-runs.resolver';
import { JointRunsService } from './joint-runs.service';

@Module({
  providers: [JointRunsResolver, JointRunsService]
})
export class JointRunsModule {}
