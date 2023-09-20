import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDraftPostDto } from './dto/create-draft-post.dto';
import { UpdateDraftPostDto } from './dto/update-draft-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DraftPost } from './entities/draft-post.entity';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { User } from 'src/user/Schema/user.schema';
import { log } from 'console';
import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';

@Injectable()
export class DraftPostService {
  constructor(
    @InjectModel(DraftPost.name) private _draftPostModel: Model<DraftPost>,
    @InjectModel(User.name) private _userModel: Model<User>,
    @InjectModel(BlogPost.name) private _blogPostModel: Model<BlogPost>,
  ) {}

  async publishDraftPost(draftId: string) {
    const draft = await this._draftPostModel.findById(draftId);
    if (!draft) throw new NotFoundException('Draft post not found');
    const user = await this._userModel.findById(draft.author);
    if (!user) throw new NotFoundException('User not found');

    const newBlogPost = new this._blogPostModel({
      title: draft.title,
      content: draft.content,
      author: draft.author,
      publishDate: new Date(),
      lastUpdated: draft.lastUpdated,
      category: draft.category,
      likes: 0,
      comments: [],
      summary: draft.summary,
      leadImage: draft.leadImage,
      isDraft: false,
    });

    // log(newBlogPost);

    await draft.deleteOne();
    await user.updateOne({ $push: { blogPosts: newBlogPost } });

    await user.updateOne({ $pull: { draftPosts: draft._id } });
    await user.save();

    return await newBlogPost.save();
  }

  async findAuthor(userID: string) {
    const user = await this._userModel.findById(userID);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  deleteMany(ids: string[]) {
    // log(ids);
    return this._draftPostModel.deleteMany({ _id: { $in: ids } });
  }

  async uploadImage(draftId: string, filename: string) {
    const draft = await this._draftPostModel.findById(draftId);
    if (!draft) throw new NotFoundException('Draft post not found');
    // log(filename);
    // filename = filename.replace(/[^A-Z0-9]+/gi, '');
    // log(filename);
    draft.leadImage = `http://localhost:3000/leadImages/${filename}`;
    return await draft.save();
  }

  async findByAuthor(userID: string) {
    const user = await this._userModel
      .findById(userID)
      .populate('draftPosts')
      .limit(5);
    if (!user) throw new NotFoundException('User not found');
    return user.draftPosts;
  }

  async devDeleteAll() {
    await this._draftPostModel.deleteMany({});
    return this._userModel.updateMany({}, { $set: { draftPosts: [] } });
  }

  async getLatestDraftPost(userID: string) {
    const draftPosts = await this._draftPostModel.find(
      { author: userID },
      {},
      { sort: { lastUpdated: -1 } },
    );
    // log(draftPosts);
    if (draftPosts.length === 0) return null;
    return draftPosts[0];
  }

  async create(createDraftPostDto: CreateDraftPostDto) {
    if (!createDraftPostDto._id) {
      var newDraftPost = new this._draftPostModel(createDraftPostDto);
      const user = await this._userModel.findById(createDraftPostDto.author);
      if (!user) throw new NotFoundException('User not found');
      user.draftPosts.push(newDraftPost);
      await user.save();
    } else {
      var newDraftPost = await this._draftPostModel.findByIdAndUpdate(
        createDraftPostDto._id,
        createDraftPostDto,
        { new: true },
      );
      if (!newDraftPost) throw new NotFoundException('Draft post not found');
    }

    return newDraftPost.save();
  }

  findAll() {
    return `This action returns all draftPost`;
  }

  findOne(id: string) {
    return this._draftPostModel.findById(id);
  }

  async update(id: number, updateDraftPostDto: UpdateDraftPostDto) {
    const draftPost = await this._draftPostModel.findById(id);
    if (!draftPost) throw new NotFoundException('Draft post not found');
    return await draftPost.updateOne(updateDraftPostDto);
  }

  async remove(id: string) {
    const draft = await this._draftPostModel.findOne({ _id: id });
    // log(draft);
    if (!draft) throw new NotFoundException('Draft post not found');
    const user = await this._userModel.findOne({ _id: draft.author });
    if (!user) throw new NotFoundException('User not found');
    await user.updateOne({ $pull: { draftPosts: draft._id } });
    await user.save();
    return await draft.deleteOne();
  }
}
