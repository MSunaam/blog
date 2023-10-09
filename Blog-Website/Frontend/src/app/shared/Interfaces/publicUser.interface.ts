import { BlogPost } from './blog';

export interface PublicProfile {
  name: string;

  email: string;

  profilePicture: string;

  bio: string;

  followerCount: number;

  likes: number;

  views: number;

  blogPosts: BlogPost[];

  isFollowing: boolean;
}
