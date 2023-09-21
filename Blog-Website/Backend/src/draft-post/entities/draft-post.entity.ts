import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export type DraftPostDocument = HydratedDocument<DraftPost>;

@Schema()
export class DraftPost {
  @Prop({ required: false })
  title: string;
  @Prop({ required: false })
  content: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  @Prop({ required: false, default: Date.now })
  lastUpdated: Date;
  @Prop({ required: false })
  category: BlogCategory;
  @Prop({ required: false })
  summary: string;
  @Prop({ required: false, default: 'Images/shoot.jpg' })
  leadImage: string;
  @Prop({ required: false, default: [] })
  tags: string[];
}

export const DraftPostSchema = SchemaFactory.createForClass(DraftPost);
