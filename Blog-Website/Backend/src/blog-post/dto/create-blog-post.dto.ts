import { ApiProperty } from '@nestjs/swagger';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';
import { User } from 'src/user/Schema/user.schema';

export class CreateBlogPostDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ type: User })
  author: User;
  @ApiProperty({ type: Date })
  publishDate: Date;
  @ApiProperty({ type: Date })
  lastUpdated: Date;
  @ApiProperty({ enum: BlogCategory })
  category: BlogCategory;
  @ApiProperty()
  likes: number;
  @ApiProperty({ type: [String] })
  comments: string[];
  @ApiProperty()
  summary: string;
  @ApiProperty()
  leadImage: string;
  @ApiProperty()
  isDraft: boolean;
  @ApiProperty({ type: [String] })
  tags: string[];
}
