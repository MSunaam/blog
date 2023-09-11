import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/Schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './constants';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name, // Name of the collection
        schema: UserSchema, // Name of the schema
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstant,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
