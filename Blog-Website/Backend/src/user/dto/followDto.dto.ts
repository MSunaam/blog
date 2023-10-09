import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
  @ApiProperty()
  followerId: string;
  @ApiProperty()
  followingId: string;
}
