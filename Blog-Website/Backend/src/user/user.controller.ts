import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/sign-in.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { FollowDto } from './dto/followDto.dto';
import { likeBlogPostDto } from './dto/likeBlogPostDto.dto';
import { ChangePasswordDto } from './dto/changePasswordDto.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  imageUrl!: string;

  @Post('follow')
  @ApiBody({ type: FollowDto })
  followUser(
    @Body('followerEmail') followerEmail: string,
    @Body('followedEmail') followedEmail: string,
  ) {
    return this.userService.followUser(followerEmail, followedEmail);
  }

  @Post('unfollow')
  @ApiBody({ type: FollowDto })
  unfollowUser(
    @Body('followerEmail') followerEmail: string,
    @Body('followedEmail') followedEmail: string,
  ) {
    return this.userService.unfollowUser(followerEmail, followedEmail);
  }

  @Post('change-password')
  @ApiBody({ type: ChangePasswordDto })
  changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('id') userId: string,
  ) {
    return this.userService.changePassword(oldPassword, newPassword, userId);
  }

  @Get('public/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'requestUserEmail', type: String })
  getPublicProfile(
    @Param('id') id: string,
    @Query('requestUserEmail') requestUserEmail: string,
  ) {
    return this.userService.getPublicProfile(id, requestUserEmail);
  }

  @Post('like')
  @ApiBody({ type: likeBlogPostDto })
  likeBlogPost(@Body('blogId') blogId: string, @Body('userId') userId: string) {
    return this.userService.likeBlogPost(blogId, userId);
  }

  @Post('unlike')
  @ApiBody({ type: likeBlogPostDto })
  unlikeBlogPost(
    @Body('blogId') blogId: string,
    @Body('userId') userId: string,
  ) {
    return this.userService.unlikeBlogPost(blogId, userId);
  }

  @Post('profileImage')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Body('email') email: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // console.log(file);
    return this.userService.setProfileImage(email, file.filename);
  }

  @Post('signin')
  @ApiBody({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto.email, signInDto.password);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('email')
  @ApiBody({ type: String })
  getUserByEmail(@Body('email') email: string) {
    // log(email);
    return this.userService.getUserByEmail(email);
  }

  @Put('reset')
  reset() {
    this.userService.resetLikes();
  }
}
