import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { type } from 'os';
import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';
import { DraftPost } from 'src/draft-post/entities/draft-post.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true })
  name: string;
  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;
  @ApiProperty()
  @Prop({ required: false })
  password: string;
  @ApiProperty()
  @Prop({ required: false, default: null })
  profilePicture: string;
  @ApiProperty({ type: [BlogPost] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }] })
  blogPosts: BlogPost[];
  @ApiProperty()
  @Prop({ required: false, default: null })
  refreshToken: string;
  @ApiProperty()
  @Prop({ required: false, default: 'Your awesome bio' })
  bio: string;
  @ApiProperty()
  @Prop({ required: false, default: 0 })
  followerCount: number;
  @ApiProperty({ type: [User] })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  followers: User[];
  @ApiProperty()
  @Prop({ required: false, default: 0 })
  likes: number;
  @ApiProperty({
    type: [User],
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  following: User[];
  @ApiProperty()
  @Prop({ required: false, default: 0 })
  views: number;
  @ApiProperty({ type: [BlogPost] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }] })
  likedPosts: BlogPost[];
  @ApiProperty({ type: [DraftPost] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DraftPost' }] })
  draftPosts: DraftPost[];
  @ApiProperty({ type: [BlogPost] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }] })
  viewedPosts: BlogPost[];
}

export const UserSchema = SchemaFactory.createForClass(User);
