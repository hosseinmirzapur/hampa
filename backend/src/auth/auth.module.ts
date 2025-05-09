import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_JWT_SECRET', // TODO: Move to environment variables
      signOptions: { expiresIn: '60m' }, // TODO: Configure expiration time
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy], // Provide JwtStrategy
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
