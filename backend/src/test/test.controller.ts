import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  @ApiOperation({ summary: 'Access a protected route (requires JWT)' })
  @ApiBearerAuth() // Indicate that this endpoint requires a bearer token
  @ApiResponse({
    status: 200,
    description: 'Successfully accessed protected route',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProtected(@Req() req) {
    // The user object is attached to the request by the JwtStrategy
    return { message: 'This is a protected route', user: req.user };
  }
}
