import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { type } from 'os';
import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: false, default: null })
  profilePicture: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }] })
  blogPosts: BlogPost[];
  @Prop({ required: false, default: null })
  refreshToken: string;
  @Prop({ required: false, default: 'Your awesome bio' })
  bio: string;
  @Prop({ required: false, default: 0 })
  followers: number;
  @Prop({ required: false, default: 0 })
  likes: number;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  following: User[];
  @Prop({ required: false, default: 0 })
  views: number;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }] })
  likedPosts: BlogPost[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }] })
  draftPosts: BlogPost[];
}

export const UserSchema = SchemaFactory.createForClass(User);
