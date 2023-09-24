import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user/dto/sign-in.dto';
import { User } from 'src/user/Schema/user.schema';
import { log } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('google-signin')
  googleSignIn(@Body('token') token: string) {
    // log(token);
    return this._authService.googleSignIn(token);
  }

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
