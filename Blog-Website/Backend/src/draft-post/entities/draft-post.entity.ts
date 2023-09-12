import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export type DraftPostDocument = HydratedDocument<DraftPost>;

@Schema()
export class DraftPost {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  @Prop({ required: false, default: Date.now })
  lastUpdated: Date;
  @Prop({ required: true })
  category: BlogCategory;
  @Prop({ required: true })
  summary: string;
  @Prop({ required: false, default: 'Images/shoot.jpg' })
  leadImage: string;
}

export const DraftPostSchema = SchemaFactory.createForClass(DraftPost);
