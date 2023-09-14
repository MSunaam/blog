import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export class CreateDraftPostDto {
  title: string;
  content: string;
  author: User;
  lastUpdated: Date;
  category: BlogCategory;
  summary: string;
  leadImage: string;
}
