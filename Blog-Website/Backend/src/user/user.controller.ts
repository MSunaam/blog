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
import { log } from 'console';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './Schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  imageUrl!: string;

  @Post('change-password')
  changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('id') userId: string,
  ) {
    return this.userService.changePassword(oldPassword, newPassword, userId);
  }

  @Get('public/:id')
  getPublicProfile(@Param('id') id: string) {
    return this.userService.getPublicProfile(id);
  }

  @Post('like')
  likeBlogPost(@Body('blogId') blogId: string, @Body('userId') userId: string) {
    return this.userService.likeBlogPost(blogId, userId);
  }

  @Post('unlike')
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
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto.email, signInDto.password);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('email')
  getUserByEmail(@Body('email') email: string) {
    // log(email);
    return this.userService.getUserByEmail(email);
  }

  @Put('reset')
  reset() {
    this.userService.resetLikes();
  }
}
