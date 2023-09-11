import { BlogCategory } from './BlogCategory.eum';
import { User } from './user';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: User;
  publishDate: string;
  lastUpdated: Date;
  category: BlogCategory;
  likes: number;
  comments: string[];
  summary: string;
  leadImage: string;
  views: number;
  isDraft: boolean;
}
export const emptyPost = (author: User): BlogPost => {
  return {
    _id: '',
    title: '',
    content: '',
    author: author,
    publishDate: new Date().toString(),
    lastUpdated: new Date(),
    category: BlogCategory.ART_CREATIVITY,
    likes: 0,
    comments: [],
    summary: '',
    leadImage: '',
    views: 0,
    isDraft: true,
  };
};
