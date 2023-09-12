import { BlogCategory } from './BlogCategory.eum';
import { User } from './user';

export interface DraftPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  lastUpdated: Date;
  category: BlogCategory;
  summary: string;
  leadImage: string;
}

export const newDraftPost = (
  _id: string = '',
  title: string = '',
  content: string = '',
  author: string = '',
  lastUpdated: string = new Date().toISOString(),
  category: BlogCategory = BlogCategory.TECHNOLOGY,
  summary: string = '',
  leadImage: string = ''
) => {
  return {
    _id,
    title,
    content,
    author,
    lastUpdated,
    category,
    summary,
    leadImage,
  };
};
