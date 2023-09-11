import { BlogPost } from './blog';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  blogPosts: BlogPost[];
  bio: string;
  followers: number;
  likes: number;
  views: number;
  likedPosts: string[];
}
