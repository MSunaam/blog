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
  tags: string[];
}

export interface BlogPostPaginated {
  posts: BlogPost[];
  count: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
