import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schema/user.schema';
import {
  BlogPost,
  BlogPostSchema,
} from 'src/blog-post/Schema/blog-post.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MulterModule.register({
      dest: './Uploads/ProfileImages',
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, './Uploads/ProfileImages');
        },
        filename: function (req, file, cb) {
          cb(
            null,
            `${Date.now()}${file.originalname.replace(/[^A-Z0-9]+/gi, '')}.${
              file.mimetype.split('/')[1]
            }`,
          );
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BlogPost.name, schema: BlogPostSchema },
    ]),
  ],
})
export class UserModule {}
