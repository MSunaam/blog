import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DraftPostService } from './draft-post.service';
import { CreateDraftPostDto } from './dto/create-draft-post.dto';
import { UpdateDraftPostDto } from './dto/update-draft-post.dto';

@Controller('draft-post')
export class DraftPostController {
  constructor(private readonly draftPostService: DraftPostService) {}

  //dev
  @Post('dev-delete-all')
  devDeleteAll() {
    return this.draftPostService.devDeleteAll();
  }

  @Post()
  create(@Body() createDraftPostDto: CreateDraftPostDto) {
    return this.draftPostService.create(createDraftPostDto);
  }

  @Get()
  findAll() {
    return this.draftPostService.findAll();
  }

  @Get('latest')
  getLatestDraftPost(@Param('userID') userID: string) {
    return this.draftPostService.getLatestDraftPost(userID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.draftPostService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDraftPostDto: UpdateDraftPostDto,
  ) {
    return this.draftPostService.update(+id, updateDraftPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.draftPostService.remove(+id);
  }
}
