import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Cannot access this resource',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }
    return user;
  }
}
