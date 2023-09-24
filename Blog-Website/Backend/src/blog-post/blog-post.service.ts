import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from './Schema/blog-post.schema';
import { User, UserDocument } from 'src/user/Schema/user.schema';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectModel(BlogPost.name) private _blogPostModel: Model<BlogPostDocument>,
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  search(query: string) {
    const queryArray = query.split(' ');
    // log(queryArray);
    return this._blogPostModel
      .find({ tags: { $in: queryArray } })
      .sort({ lastUpdated: -1 })
      .populate('author')
      .exec();
  }

  async saveDraft(createBlogPostDto: CreateBlogPostDto) {
    createBlogPostDto.tags = createBlogPostDto.tags.map((tag) =>
      tag.toLowerCase(),
    );
    const user = await this._userModel.findOne({
      email: createBlogPostDto.author.email,
    });
    if (!user) throw new NotFoundException('User not found');
    const createdBlogPost = new this._blogPostModel(createBlogPostDto);
    await user.updateOne({ $push: { draftPosts: createdBlogPost } });
    return await createdBlogPost.save();
  }
  async findLatest() {
    return await this._blogPostModel
      .find()
      .sort({ lastUpdated: -1 })
      .limit(5)
      .populate('author')
      .exec();
  }

  async create(createBlogPostDto: CreateBlogPostDto) {
    createBlogPostDto.tags = createBlogPostDto.tags.map((tag) =>
      tag.toLowerCase(),
    );
    const user = await this._userModel.findById(createBlogPostDto.author);
    if (!user) throw new NotFoundException('User not found');
    const createdBlogPost = new this._blogPostModel(createBlogPostDto);
    user.blogPosts.push(createdBlogPost);
    await user.save();
    return await createdBlogPost.save();
  }

  async findAll() {
    return await this._blogPostModel.find().populate('author').exec();
  }

  async findOne(id: string) {
    return this._blogPostModel.findById(id).populate('author').exec();
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    updateBlogPostDto.tags = updateBlogPostDto.tags.map((tag) =>
      tag.toLowerCase(),
    );
    updateBlogPostDto.lastUpdated = new Date();
    return await this._blogPostModel
      .findByIdAndUpdate(id, updateBlogPostDto, {
        new: true,
      })
      .populate('author')
      .exec();
  }

  async remove(id: string) {
    const post = await this._blogPostModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    const user = await this._userModel.findById(post.author);
    if (!user) throw new NotFoundException('User not found');
    await user.updateOne({ $pull: { blogPosts: id } });
    return (await post.deleteOne()).populate('author');
  }

  findByAuthor(author: string) {
    return this._blogPostModel.find({ author: author }).exec();
  }
}
