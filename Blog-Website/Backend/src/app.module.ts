import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPostModule } from './blog-post/blog-post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { DraftPostModule } from './draft-post/draft-post.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/blog-website'),
    BlogPostModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'Uploads'),
    }),
    AuthModule,
    DraftPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
