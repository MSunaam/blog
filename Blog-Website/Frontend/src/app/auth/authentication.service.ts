import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, lastValueFrom } from 'rxjs';
import { SignInRes } from '../shared/Interfaces/signInRes.interface';
import { User } from '../shared/Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private _router: Router, private _httpClient: HttpClient) {}

  baseUrl: string = 'http://localhost:3000/auth';

  signin(email: string, password: string): Observable<SignInRes> {
    return this._httpClient.post(`${this.baseUrl}/signin`, {
      email: email,
      password: password,
    }) as Observable<SignInRes>;
  }

  signup(email: string, password: string, name: string): Observable<SignInRes> {
    return this._httpClient.post(`${this.baseUrl}/signup`, {
      email: email,
      password: password,
      name: name,
    }) as Observable<SignInRes>;
  }

  storeUserAndToken(res: SignInRes) {
    localStorage.setItem('refresh_token', res.refresh_token);
    localStorage.setItem('resfreshExpiry', res.refreshExpiry);
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('accessExpiry', res.accessExpiry);
    localStorage.setItem('user', JSON.stringify(res.user));
  }
  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }
  isLoggedIn() {
    const currentUser = localStorage.getItem('user');
    if (currentUser) return true;
    return false;
  }
  async logout() {
    if (!this.isLoggedIn()) {
      this._router.navigate(['/auth']);
      localStorage.clear();
      return;
    }

    lastValueFrom(
      this._httpClient.post(`${this.baseUrl}/signout`, {
        email: (JSON.parse(localStorage.getItem('user')!) as User).email,
      })
    )
      .then((res) => {
        // console.log(res);
        this._router.navigate(['/auth']);
      })
      .catch((err) => {
        console.log(err);
      });
    localStorage.clear();
  }
}
