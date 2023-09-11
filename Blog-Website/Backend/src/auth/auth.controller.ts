import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user/dto/sign-in.dto';
import { User } from 'src/user/Schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this._authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup')
  signUp(@Body() user: User) {
    return this._authService.signUp(user);
  }

  @Post('signout')
  signOut(@Body('email') email: string) {
    return this._authService.signOut(email);
  }
}
