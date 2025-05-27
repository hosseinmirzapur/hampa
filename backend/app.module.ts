import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './src/prisma/prisma.service'; // Corrected import path
import { AuthModule } from './src/auth/auth.module'; // Corrected import path
import { TestController } from './src/test/test.controller'; // Corrected import path
import { UsersModule } from './src/users/users.module'; // Corrected import path
import { RunnerCardsModule } from './src/runner-cards/runner-cards.module'; // Corrected import path
import { JointRunsModule } from './src/joint-runs/joint-runs.module'; // Corrected import path
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { GraphQLModule } from '@nestjs/graphql';
import { NotificationsModule } from './src/src/notifications/notifications.module';
import { NotificationsService } from './src/src/src/notifications/notifications/notifications.service';
import { NotificationsController } from './src/src/src/notifications/notifications/notifications.controller';
import { SubscriptionsModule } from './src/src/subscriptions/subscriptions.module';
import { SubscriptionsService } from './src/src/src/subscriptions/subscriptions/subscriptions.service';
import { SubscriptionsController } from './src/src/src/subscriptions/subscriptions/subscriptions.controller';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql', // Path to generate the schema file
      sortSchema: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as any, // Type assertion needed for cache-manager v6+
        host: configService.get<string>('REDIS_HOST') || 'localhost', // TODO: Use environment variable
        port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10), // TODO: Use environment variable
        // Add other Redis options if needed
      }),
      inject: [ConfigService],
      isGlobal: true, // Make cache module available globally
    }),
    AuthModule,
    UsersModule,
    RunnerCardsModule,
    JointRunsModule,
    NotificationsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController, TestController, NotificationsController, SubscriptionsController],
  providers: [AppService, PrismaService, NotificationsService, SubscriptionsService],
})
export class AppModule {}
