import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from './Schema/blog-post.schema';
import { User, UserDocument } from 'src/user/Schema/user.schema';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { BlogCategory } from 'src/Shared/Enums/BlogCategory.enum';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectModel(BlogPost.name) private _blogPostModel: Model<BlogPostDocument>,
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  static pageSize = 2;

  async random() {
    const post = await this._blogPostModel.aggregate([
      {
        $sample: { size: 1 },
      },
    ]);
    if (post.length === 0) throw new NotFoundException('Post not found');
    const author = await this._userModel.findById(post[0].author);
    post[0].author = author;
    return post;
  }
  async findPopular() {
    return await this._blogPostModel
      .find()
      .sort({ views: -1, lastUpdated: -1 })
      .limit(5)
      .populate('author')
      .exec();
  }
  async findByCategory(category: BlogCategory) {
    return await this._blogPostModel
      .find(
        { category: category },
        {},
        {
          limit: 10,
          sort: { lastUpdated: -1 },
        },
      )
      .populate('author')
      .exec();
  }

  async increaseViewCount(id: string, email: string) {
    const post = await this._blogPostModel.findById(id);
    const user = await this._userModel.findOne({ email: email });
    if (!user) throw new NotFoundException('User not found');
    if (user.viewedPosts.includes(post.id)) return;
    user.viewedPosts.push(post);
    await user.save();
    if (!post) throw new NotFoundException('Post not found');
    post.views++;
    return (await post.save()).populate('author');
  }

  async search(query: string, pageNumber: number = 0) {
    const queryArray = query.split(' ');
    log(queryArray);

    let posts = await this._blogPostModel.find({
      $or: [{ tags: { $in: queryArray } }, { title: { $in: queryArray } }],
    });

    const totalPages = Math.ceil(posts.length / BlogPostService.pageSize);

    posts = await this._blogPostModel
      .find({
        $or: [{ tags: { $in: queryArray } }],
      })
      .sort({ lastUpdated: -1 })
      .limit(BlogPostService.pageSize)
      .skip(pageNumber * BlogPostService.pageSize)
      .populate('author')
      .exec();

    return {
      posts: posts,
      count: posts.length,
      currentPage: +pageNumber + 1,
      totalPages: totalPages,
      pageSize: BlogPostService.pageSize,
    };
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
