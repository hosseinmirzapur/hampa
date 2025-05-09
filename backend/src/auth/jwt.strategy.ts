import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Let Passport handle expiration
      secretOrKey: 'YOUR_JWT_SECRET', // TODO: Use environment variable
    });
  }

  async validate(payload: any) {
    // The payload is the decoded JWT payload.
    // We expect it to contain the user ID.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Return the user object. This will be attached to the request object (req.user)
    return user;
  }
}
