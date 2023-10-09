import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema()
export class BlogPost {
  @ApiProperty()
  @Prop({ required: true })
  title: string;
  @ApiProperty()
  @Prop({ required: true })
  content: string;
  @ApiProperty({ type: () => User })
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  @ApiProperty({ type: Date })
  @Prop({ required: true, default: Date.now })
  publishDate: Date;
  @ApiProperty({ type: Date })
  @Prop({ required: false, default: Date.now })
  lastUpdated: Date;
  @ApiProperty({ enum: BlogCategory })
  @Prop({ required: true })
  category: BlogCategory;
  @ApiProperty()
  @Prop({ required: false, default: 0 })
  likes: number;
  @ApiProperty({ type: [String] })
  @Prop({ required: false })
  comments: string[];
  @ApiProperty()
  @Prop({ required: true })
  summary: string;
  @ApiProperty()
  @Prop({ required: false, default: 'Images/shoot.jpg' })
  leadImage: string;
  @ApiProperty()
  @Prop({ required: false, default: 0 })
  views: number;
  @ApiProperty()
  @Prop({ required: true, default: false })
  isDraft: boolean;
  @ApiProperty({ type: [String] })
  @Prop({ required: false, default: [] })
  tags: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
