import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';

export class PublicProfileDto {
  name: string;
  profilePicture: string;
  bio: string;
  followers: number;
  likes: number;
  views: number;
  blogPosts: BlogPost[];
}
