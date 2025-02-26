import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromParam = request.params.id;

    if (user.userId !== userIdFromParam) {
      throw new ForbiddenException({
        message: 'You are not allowed to modify this user',
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return true;
  }
}
