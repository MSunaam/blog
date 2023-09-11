import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  blogPosts: BlogPost[];
  refreshToken: string;
  bio: string;
  followers: number;
  likes: number;
  views: number;
}
