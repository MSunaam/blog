import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { log } from 'console';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('random')
  random() {
    return this.blogPostService.random();
  }

  @Get('popular')
  findPopular() {
    return this.blogPostService.findPopular();
  }

  @Get('category/:cat')
  findByCategory(@Param('cat') category: string) {
    category = category.toUpperCase();
    // log(category);
    const cat = BlogCategory[category];
    // log(cat);
    return this.blogPostService.findByCategory(cat);
  }

  @Post('view')
  increaseViewCount(@Body('id') id: string, @Body('email') email: string) {
    return this.blogPostService.increaseViewCount(id, email);
  }

  @Get('search')
  search(
    @Query('tags') query: string,
    @Query('pageNumber') pageNumber: number,
  ) {
    return this.blogPostService.search(query, pageNumber);
  }

  @Post()
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostService.create(createBlogPostDto);
  }

  @Get()
  findAll() {
    return this.blogPostService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.blogPostService.findLatest();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogPostService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogPostService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogPostService.remove(id);
  }

  @Get('author/:author')
  findByAuthor(@Param('author') author: string) {
    return this.blogPostService.findByAuthor(author);
  }
}
