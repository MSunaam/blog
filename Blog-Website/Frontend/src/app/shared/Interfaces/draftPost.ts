import { BlogCategory } from './BlogCategory.eum';
import { User } from './user';

export interface DraftPost {
  _id?: string;
  title: string;
  content: string;
  author: string;
  lastUpdated: string;
  category: BlogCategory;
  summary: string;
  leadImage: string;
}

export const newDraftPost = (user: User): DraftPost => {
  return {
    title: '',
    content: '',
    author: user._id,
    lastUpdated: new Date().toISOString(),
    category: BlogCategory.TECHNOLOGY,
    summary: '',
    leadImage: '',
  };
};
