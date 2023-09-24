import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/Services/user.service';
import { AuthenticationService } from './auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _authService: AuthenticationService
  ) {}
  title = 'blog-website';

  ngOnInit(): void {
    if (this._authService.isLoggedIn()) {
      this._userService.setUser(this._authService.getUser());
    }
  }
}
