import { Module } from '@nestjs/common';
import { DraftPostService } from './draft-post.service';
import { DraftPostController } from './draft-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DraftPost, DraftPostSchema } from './entities/draft-post.entity';
import { User } from 'src/user/Schema/user.schema';

@Module({
  controllers: [DraftPostController],
  providers: [DraftPostService],
  imports: [
    MongooseModule.forFeature([
      { name: DraftPost.name, schema: DraftPostSchema },
      { name: User.name, schema: User },
    ]),
  ],
})
export class DraftPostModule {}
