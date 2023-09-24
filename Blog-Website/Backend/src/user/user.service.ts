import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserExistsException } from 'src/Shared/Exceptions/UserExistsException';
import { BlogPost } from 'src/blog-post/Schema/blog-post.schema';
import { PublicProfileDto } from './dto/publicProfile.dto';
import { log } from 'console';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    @InjectModel(BlogPost.name) private _blogModel: Model<BlogPost>,
  ) {}

  async changePassword(
    oldPassword: string,
    newPassword: string,
    userId: string,
  ) {
    const user = await this._userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!bcrypt.compareSync(oldPassword, user.password))
      throw new NotFoundException('Password is incorrect');
    user.password = bcrypt.hashSync(newPassword, 10);
    return await user.save();
  }

  async likeBlogPost(blogId: string, userId: string) {
    const blogPost = await this._blogModel.findById(blogId);
    const user = await this._userModel.findById(userId);
    if (!blogPost) throw new NotFoundException('Blog post not found');
    if (!user) throw new NotFoundException('User not found');
    if (user.likedPosts.includes(blogPost.id))
      //change exception later
      throw new NotFoundException('User already liked this post');
    user.likedPosts.push(blogPost.id);
    await user.save();
    // log(user.likedPosts);
    blogPost.likes += 1;
    await blogPost.save();
    await blogPost.populate('author');
    return {
      user: user,
      blogPost: blogPost,
    };
  }

  async unlikeBlogPost(blogId: string, userId: string) {
    const blogPost = await this._blogModel.findById(blogId);
    if (!blogPost) throw new NotFoundException('Blog post not found');
    const user = await this._userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.likedPosts.includes(blogPost.id)) {
      throw new NotFoundException('User did not like this post');
    }
    await user.updateOne({ $pull: { likedPosts: blogPost.id } });
    await user.save();
    log(user.likedPosts);
    blogPost.likes -= 1;
    await blogPost.save();
    await blogPost.populate('author');
    return {
      user: user,
      blogPost: blogPost,
    };
  }

  async getPublicProfile(id: string) {
    const user = await this._userModel.findById(id).populate({
      path: 'blogPosts',
      options: { limit: 5 },
      select: [
        'title',
        'publishDate',
        'summary',
        'leadImage',
        'category',
        'likes',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    const publicProfile: PublicProfileDto = {
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      likes: user.likes,
      views: user.views,
      blogPosts: user.blogPosts,
    };
    return publicProfile;
  }

  async setProfileImage(email: string, profileImage: string) {
    const currentUser = await this._userModel.findOne({ email: email });
    if (!currentUser) throw new NotFoundException('User not found');
    profileImage = profileImage.replace(/[^A-Z0-9.]+/gi, '_');
    currentUser.profilePicture = `http://localhost:3000/profileimages/${profileImage}`;
    return await currentUser.save();
  }

  async getUserByEmail(email: string) {
    const user = (await this._userModel.findOne({ email: email })).populate(
      'blogPosts',
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async signIn(email: string, password: string) {
    const user = await this._userModel.findOne({ email: email });
    if (!user) throw new NotFoundException('User not found');
    if (!bcrypt.compareSync(password, user.password))
      throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this._userModel.findOne({ email: createUserDto.email });
    // console.log(user);

    //User already exists
    if (user) {
      throw new UserExistsException();
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const createdUser = new this._userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll() {
    return await this._userModel.find().populate('blogPosts').exec();
  }

  async findOne(id: string) {
    const user = await this._userModel
      .findById(id)
      .populate('blogPosts')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this._userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return await this._userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    const user = await this._userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const blogPosts = user.blogPosts;
    blogPosts.forEach(async (blogPost) => {
      await this._blogModel.deleteOne({ _id: blogPost });
    });
    return await user.deleteOne();
  }

  resetLikes() {
    this._userModel.updateMany({ $set: { likedPosts: [] } }).exec();
    this._blogModel.updateMany({}, { $set: { likes: 0 } }).exec();
  }
}
