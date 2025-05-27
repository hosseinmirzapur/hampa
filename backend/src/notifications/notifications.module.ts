import { Module } from '@nestjs/common';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsResolver, NotificationsService],
})
export class NotificationsModule {}
