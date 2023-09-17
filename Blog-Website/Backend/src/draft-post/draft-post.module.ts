import { Module } from '@nestjs/common';
import { DraftPostService } from './draft-post.service';
import { DraftPostController } from './draft-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DraftPost, DraftPostSchema } from './entities/draft-post.entity';
import { User } from 'src/user/Schema/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [DraftPostController],
  providers: [DraftPostService],
  imports: [
    MulterModule.register({
      dest: './Uploads/leadImages',
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, './Uploads/leadImages');
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
      { name: DraftPost.name, schema: DraftPostSchema },
      { name: User.name, schema: User },
    ]),
  ],
})
export class DraftPostModule {}
