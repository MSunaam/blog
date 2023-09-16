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

  getDraftById(id: string) {
    return this._httpClient.get<DraftPost>(
      `http://localhost:3000/draft-post/${id}`
    );
  }

  getAllDrafts(userId: string) {
    return this._httpClient.get<DraftPost[]>(
      `http://localhost:3000/draft-post/user/${userId}`
    );
  }

  saveDraftPost(draftPost: DraftPost) {
    // console.log(draftPost);

    return this._httpClient.post<DraftPost>(
      'http://localhost:3000/draft-post',
      { ...draftPost }
    );
  }

  setPreviewPost(blogPost: BlogPost) {
    // console.log(blogPost);
    // console.log('set');
    localStorage.setItem('previewPost', JSON.stringify(blogPost));

    this.previewBlogPost.next(blogPost);
  }

  getPreviewPost() {
    return this.previewBlogPost.asObservable();
  }

  getLatestDraftPost(userID: string) {
    // console.log('get');
    return this._httpClient.get<DraftPost | null>(
      'http://localhost:3000/draft-post/latest',
      {
        params: { userID: userID },
      }
    );
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
