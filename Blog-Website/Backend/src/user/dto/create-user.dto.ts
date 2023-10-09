import { ApiProperty } from '@nestjs/swagger';
import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';

export class CreateUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  profilePicture: string;
  @ApiProperty({
    type: [BlogPost],
  })
  blogPosts: BlogPost[];
  @ApiProperty()
  refreshToken: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  likes: number;
  @ApiProperty()
  views: number;
}
