import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor() {
    super('User Already Exists', HttpStatus.FORBIDDEN);
  }
}
