import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  oldPassword: string;
  @ApiProperty()
  newPassword: string;
}
