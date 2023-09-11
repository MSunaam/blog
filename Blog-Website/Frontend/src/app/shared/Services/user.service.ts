import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Interfaces/user';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { BlogPost } from '../Interfaces/blog';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _httpClient: HttpClient) {}

  changePassword(
    oldPassword: string,
    newPassword: string,

    _id: string
  ) {
    return this._httpClient.post<User>(
      'http://localhost:3000/user/change-password',
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
        id: _id,
      }
    );
  }

  baseUrl: string = 'http://localhost:3000/user/';
  user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  uploadProfilePicture(file: File, email: string): Observable<User> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', file);

    return this._httpClient.post(
      `${this.baseUrl}profileimage`,
      formData
    ) as Observable<User>;
  }

  updateUser(user: User) {
    return this._httpClient.patch<User>(`${this.baseUrl}${user._id}`, user);
  }

  storeUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  setUser(user: User) {
    this.storeUser(user);
    this.user$.next(user);
  }

  refreshLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    this.getUserByEmail(user.email).subscribe({
      next: (user: User) => {
        this.setUser(user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getUserByIdPublic(id: string): Observable<User> {
    return this._httpClient.get<User>(`${this.baseUrl}public/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    return this._httpClient.post<User>(`${this.baseUrl}email`, {
      email: user.email,
    }) as Observable<User>;
  }

  getUserBlogPosts(userId: string): Observable<BlogPost[]> {
    return this._httpClient.get<BlogPost[]>(
      `http://localhost:3000/blog-post/author/${userId}`
    ) as Observable<BlogPost[]>;
  }
}
