import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UseInterceptors,
} from '@nestjs/common';
import { DraftPostService } from './draft-post.service';
import { CreateDraftPostDto } from './dto/create-draft-post.dto';
import { UpdateDraftPostDto } from './dto/update-draft-post.dto';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('draft-post')
export class DraftPostController {
  constructor(private readonly draftPostService: DraftPostService) {}

  //dev
  @Post('dev-delete-all')
  devDeleteAll() {
    return this.draftPostService.devDeleteAll();
  }

  @Post('publish')
  publishDraftPost(@Body('draftId') draftId: string) {
    return this.draftPostService.publishDraftPost(draftId);
  }

  @Get('author/:userID')
  findAuthor(@Param('userID') userID: string) {
    return this.draftPostService.findAuthor(userID);
  }

  @Post()
  create(@Body() createDraftPostDto: CreateDraftPostDto) {
    // log(createDraftPostDto);
    return this.draftPostService.create(createDraftPostDto);
  }

  @Get('user/:userID')
  findByAuthor(@Param('userID') userID: string) {
    return this.draftPostService.findByAuthor(userID);
  }

  @Get()
  findAll() {
    return this.draftPostService.findAll();
  }

  @Get('latest')
  getLatestDraftPost(@Query('userID') userID: string) {
    return this.draftPostService.getLatestDraftPost(userID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.draftPostService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDraftPostDto: UpdateDraftPostDto,
  ) {
    return this.draftPostService.update(+id, updateDraftPostDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.draftPostService.remove(id);
  // }

  @Delete('delete-many')
  deleteMany(@Body('ids') ids: string[]) {
    // log(ids);
    return this.draftPostService.deleteMany(ids);
  }

  @Post('lead-image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Body('draftId') draftId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.draftPostService.uploadImage(draftId, file.filename);
  }
}
