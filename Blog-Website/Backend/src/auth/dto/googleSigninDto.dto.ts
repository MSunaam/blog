import { ApiProperty } from '@nestjs/swagger';

export class GoogleSignInDto {
  @ApiProperty()
  token: string;
}
