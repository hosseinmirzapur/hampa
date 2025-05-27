import { Module } from '@nestjs/common';
import { JointRunsResolver } from './joint-runs.resolver';
import { JointRunsService } from './joint-runs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [JointRunsResolver, JointRunsService],
})
export class JointRunsModule {}
