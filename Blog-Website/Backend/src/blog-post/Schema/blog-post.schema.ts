import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema()
export class BlogPost {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  @Prop({ required: true, default: Date.now })
  publishDate: Date;
  @Prop({ required: false, default: Date.now })
  lastUpdated: Date;
  @Prop({ required: true })
  category: BlogCategory;
  @Prop({ required: false, default: 0 })
  likes: number;
  @Prop({ required: false })
  comments: string[];
  @Prop({ required: true })
  summary: string;
  @Prop({ required: false, default: 'Images/shoot.jpg' })
  leadImage: string;
  @Prop({ required: false, default: 0 })
  views: number;
  @Prop({ required: true, default: false })
  isDraft: boolean;
  @Prop({ required: false, default: [] })
  tags: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
