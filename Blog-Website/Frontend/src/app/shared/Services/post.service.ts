import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogPost } from '../Interfaces/blog';
import { User } from '../Interfaces/user';
import { ReplaySubject, Subject } from 'rxjs';
import { DraftPost, newDraftPost } from '../Interfaces/draftPost';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private _httpClient: HttpClient) {}

  baseUrl: string = 'http://localhost:3000/blog-post/';

  previewBlogPost: ReplaySubject<BlogPost> = new ReplaySubject<BlogPost>(1);

  saveDraftPost(draftPost: BlogPost) {
    // console.log(draftPost);
    const savePost = newDraftPost(
      draftPost._id,
      draftPost.title,
      draftPost.content,
      draftPost.author._id,
      '',
      draftPost.category,
      draftPost.summary,
      draftPost.leadImage
    );

    return this._httpClient.post<DraftPost>(
      'http://localhost:3000/draft-post',
      { savePost }
    );
  }

  setPreviewPost(blogPost: BlogPost) {
    // console.log(blogPost);
    // console.log('set');
    localStorage.setItem('previewPost', JSON.stringify(blogPost));

    this.previewBlogPost.next(blogPost);
  }

  getPreviewPost() {
    // console.log('get');
    const previewPost = localStorage.getItem('previewPost');
    if (previewPost) {
      this.previewBlogPost.next(JSON.parse(previewPost));
    }
    return this.previewBlogPost.asObservable();
  }

  getBlogPost(id: string) {
    return this._httpClient.get<BlogPost>(`${this.baseUrl}${id}`);
  }

  likeBlogPost(userId: string, blogId: string) {
    return this._httpClient.post<{ user: User; blogPost: BlogPost }>(
      `http://localhost:3000/user/like`,
      {
        userId: userId,
        blogId: blogId,
      }
    );
  }
  unlikeBlogPost(userId: string, blogId: string) {
    return this._httpClient.post<{ user: User; blogPost: BlogPost }>(
      `http://localhost:3000/user/unlike`,
      {
        userId: userId,
        blogId: blogId,
      }
    );
  }
}
