import { HttpException, HttpStatus } from '@nestjs/common';

export class Blogexists extends HttpException {
  constructor() {
    super('Blog Already Exists', HttpStatus.FORBIDDEN);
  }
}
