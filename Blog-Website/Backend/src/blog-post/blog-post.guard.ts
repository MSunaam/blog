import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable()
export class BlogGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    token = token.split(' ')[1];
    // log(token);
    if (!token) return false;
    try {
      var verify = this.jwtService.verify(token);
    } catch (err) {
      return false;
    }
    // log(verify);
    if (!verify) return false;
    return true;
  }
}
