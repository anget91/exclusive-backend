import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    const userIdFromParam = request.params.id; 
    const userIdFromQuery = request.query.userId; 

    const userId = userIdFromParam || userIdFromQuery; 

    if (!userId || user.userId !== userId) { 
      throw new ForbiddenException({
        message: 'You are not allowed to modify this user',
        error: 'Forbidden',
        statusCode: 403,
      });
    }

    return true; 
  }
}
