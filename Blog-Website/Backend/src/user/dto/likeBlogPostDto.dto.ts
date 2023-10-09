import { ApiProperty } from '@nestjs/swagger';

export class likeBlogPostDto {
  @ApiProperty()
  blogId: string;
  @ApiProperty()
  userId: string;
}
