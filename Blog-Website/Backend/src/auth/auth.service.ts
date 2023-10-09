import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/Schema/user.schema';
import * as bcrypt from 'bcrypt';
import { UserExistsException } from 'src/Shared/Exceptions/UserExistsException';
import { OAuth2Client } from 'google-auth-library';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    @InjectConnection() private _connection: mongoose.Connection,
    private _jwtService: JwtService,
  ) {}

  async googleSignIn(token: string) {
    const transactionSession = await this._connection.startSession();
    transactionSession.startTransaction();

    try {
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience:
          '316939370269-upanebcdsktfe2l8oa522a6ne17nhlpu.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      if (!payload) throw new NotFoundException('User not found');
      const { email, name, picture } = payload;
      var user = await this._userModel.findOne({ email: email });
      if (user) {
        // console.log(email, name, picture);
        user.name = name;
        user.profilePicture = picture;
        await user.save();
      } else {
        user = new this._userModel({
          email: email,
          name: name,
          profilePicture: picture,
        });
        await user.save();
      }

      const accessPayload = { email: email, sub: user._id };
      const refreshPayload = { email: email, sub: user._id };

      const accessToken = this._jwtService.sign(accessPayload);
      const refreshToken = this._jwtService.sign(refreshPayload);

      await this._userModel.updateOne(
        { id: user.id },
        { refreshToken: refreshToken },
      );

      transactionSession.commitTransaction();

      return {
        access_token: accessToken,
        accessExpiry: '1d',
        refresh_token: refreshToken,
        refreshExpiry: '7d',
        user: user,
      };
    } catch (error) {
      transactionSession.abortTransaction();
      throw error;
    } finally {
      transactionSession.endSession();
    }
  }

  async signOut(email: string) {
    const currentUser = await this._userModel.findOne({ email: email });
    if (!currentUser) throw new NotFoundException('User not found');
    currentUser.refreshToken = null;
    await currentUser.save();
    return { message: 'User logged out' };
  }

  async signIn(email: string, password: string) {
    const user = await this._userModel.findOne({ email: email });
    if (!user) throw new NotFoundException('User not found');
    if (!bcrypt.compareSync(password, user.password)) {
      throw new NotFoundException('User not found');
    }
    const accessPayload = { email: user.email, sub: user._id };
    const refreshPayload = { email: user.email, sub: user._id };

    const refreshToken = this._jwtService.sign(refreshPayload);

    await this._userModel
      .findByIdAndUpdate(user._id, { refreshToken: refreshToken })
      .exec();

    return {
      access_token: this._jwtService.sign(accessPayload),
      accessExpiry: '1d',
      refresh_token: refreshToken,
      refreshExpiry: '7d',
      user: user,
    };
  }

  async signUp(newUser: User) {
    const user = await this._userModel.findOne({ email: newUser.email });
    if (user) throw new UserExistsException();
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    const createdUser = new this._userModel(newUser);

    await createdUser.save();

    const accessPayload = { email: createdUser.email, sub: createdUser._id };
    const refreshPayload = { email: createdUser.email, sub: createdUser._id };

    const refreshToken = this._jwtService.sign(refreshPayload);

    await this._userModel
      .findByIdAndUpdate(createdUser._id, { refreshToken: refreshToken })
      .exec();

    return {
      access_token: this._jwtService.sign(accessPayload),
      accessExpiry: '1d',
      refresh_token: refreshToken,
      refreshExpiry: '7d',
      user: createdUser,
    };
  }
}
