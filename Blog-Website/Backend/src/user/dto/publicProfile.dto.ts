import { ApiProperty } from '@nestjs/swagger';
import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';

export class PublicProfileDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profilePicture: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  followerCount: number;
  @ApiProperty()
  likes: number;
  @ApiProperty()
  views: number;
  @ApiProperty({ type: [BlogPost] })
  blogPosts: BlogPost[];
  @ApiProperty()
  isFollowing: boolean;
}
