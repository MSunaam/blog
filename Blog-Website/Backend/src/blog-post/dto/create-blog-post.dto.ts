import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export class CreateBlogPostDto {
  title: string;
  content: string;
  author: User;
  publishDate: Date;
  lastUpdated: Date;
  category: BlogCategory;
  likes: number;
  comments: string[];
  summary: string;
  leadImage: string;
  isDraft: boolean;
}
