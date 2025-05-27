import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RunnerCardsModule } from './runner-cards/runner-cards.module';
import { JointRunsModule } from './joint-runs/joint-runs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Make ConfigModule global
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Generates schema.gql at root of src
      sortSchema: true,
      playground: true, // Enables GraphQL Playground for testing and documentation
      context: ({ req, res }) => ({ req, res }), // Important for GqlAuthGuard to access request
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: 300, // default cache TTL in seconds
      }),
      inject: [ConfigService],
      isGlobal: true, // Make CacheModule global
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RunnerCardsModule,
    JointRunsModule,
    NotificationsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}