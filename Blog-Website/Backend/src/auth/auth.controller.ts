import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user/dto/sign-in.dto';
import { User } from 'src/user/Schema/user.schema';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { GoogleSignInDto } from './dto/googleSigninDto.dto';
import { SignOutDto } from './dto/signOutDto.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('google-signin')
  @ApiBody({ type: GoogleSignInDto })
  googleSignIn(@Body('token') token: string) {
    // log(token);
    return this._authService.googleSignIn(token);
  }

  @Post('signin')
  @ApiProperty({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    return this._authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup')
  @ApiProperty({ type: User })
  signUp(@Body() user: User) {
    return this._authService.signUp(user);
  }

  @Post('signout')
  @ApiProperty({ type: SignOutDto })
  signOut(@Body('email') email: string) {
    return this._authService.signOut(email);
  }
}
