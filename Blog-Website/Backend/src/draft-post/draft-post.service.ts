import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDraftPostDto } from './dto/create-draft-post.dto';
import { UpdateDraftPostDto } from './dto/update-draft-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DraftPost } from './entities/draft-post.entity';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { User } from 'src/user/Schema/user.schema';
import { log } from 'console';

@Injectable()
export class DraftPostService {
  constructor(
    @InjectModel(DraftPost.name) private _draftPostModel: Model<DraftPost>,
    @InjectModel(User.name) private _userModel: Model<User>,
  ) {}

  async devDeleteAll() {
    await this._draftPostModel.deleteMany({});
    return this._userModel.updateMany({}, { $set: { draftPosts: [] } });
  }

  async create(createDraftPostDto: CreateDraftPostDto) {
    const checkPost = await this._draftPostModel
      .findOne({})
      .where('title')
      .equals(createDraftPostDto.title);
    if (checkPost) {
      return this.update(checkPost.id, createDraftPostDto);
    }
    log(createDraftPostDto.author);
    // const newDraftPost = new this._draftPostModel(createDraftPostDto);
    // const user = await this._userModel.findOne({
    //   email: createDraftPostDto.author.email,
    // });
    // if (!user) throw new NotFoundException('User not found');
    // user.draftPosts.push(newDraftPost);
    // await user.save();
    // return newDraftPost.save();
  }

  findAll() {
    return `This action returns all draftPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} draftPost`;
  }

  async update(id: number, updateDraftPostDto: UpdateDraftPostDto) {
    const draftPost = await this._draftPostModel.findById(id);
    if (!draftPost) throw new NotFoundException('Draft post not found');
    return await draftPost.updateOne(updateDraftPostDto);
  }

  remove(id: number) {
    return `This action removes a #${id} draftPost`;
  }
}