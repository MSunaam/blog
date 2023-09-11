import { Module } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, BlogPostSchema } from './Schema/blog-post.schema';
import { User, UserSchema } from 'src/user/Schema/user.schema';

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService],
  imports: [
    MongooseModule.forFeature([
      { name: BlogPost.name, schema: BlogPostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class BlogPostModule {}
