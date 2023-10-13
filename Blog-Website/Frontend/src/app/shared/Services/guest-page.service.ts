import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogPost } from '../Interfaces/blog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestPageService {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = 'http://localhost:3000/';

  getLatestPosts(): Observable<BlogPost[]> {
    return this._httpClient.get(
      `${this.baseUrl}blog-post/latest`
    ) as Observable<BlogPost[]>;
  }

  getPopularPosts() {
    return this._httpClient.get(`${this.baseUrl}blog-post/popular`);
  }
}
