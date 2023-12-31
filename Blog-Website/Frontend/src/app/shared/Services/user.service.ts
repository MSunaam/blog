import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Interfaces/user';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { BlogPost } from '../Interfaces/blog';
import { PublicProfile } from '../Interfaces/publicUser.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _httpClient: HttpClient) {}

  followUser(followerEmail: string, followedEmail: string) {
    // console.log(followerEmail, followedEmail);

    return this._httpClient.post<User>('http://localhost:3000/user/follow', {
      followerEmail: followerEmail,
      followedEmail: followedEmail,
    });
  }

  unfollowUser(followerEmail: string, followedEmail: string) {
    return this._httpClient.post<User>('http://localhost:3000/user/unfollow', {
      followerEmail: followerEmail,
      followedEmail: followedEmail,
    });
  }

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
    if (!user) return;
    this.getUserByEmail(user.email).subscribe({
      next: (user: User) => {
        this.setUser(user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getUserByIdPublic(id: string, email: string = ''): Observable<PublicProfile> {
    return this._httpClient.get<PublicProfile>(`${this.baseUrl}public/${id}`, {
      params: { requestUserEmail: email },
    });
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
