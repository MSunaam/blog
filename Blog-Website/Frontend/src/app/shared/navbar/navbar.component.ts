import { JsonPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { User } from '../Interfaces/user';
import { UserService } from '../Services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  host: {
    '(document:click)': 'onClick($event)',
  },
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(
    private _authService: AuthenticationService,
    private _userService: UserService,
    private _sanitizer: DomSanitizer
  ) {}

  showUserMenu: boolean = false;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  user!: User;

  @ViewChild('userMenuButton') userMenuButton!: ElementRef;
  @ViewChild('userMenu') userMenu!: ElementRef;

  onClick(event: any) {
    if (!this.isLoggedIn) {
      return;
    }
    if (this.userMenuButton) {
      if (!this.userMenuButton.nativeElement.contains(event.target)) {
        this.showUserMenu = false;
      }
    }
  }

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  logout() {
    this.isLoggedIn = false;
    this._authService.logout();
  }
  navbarLinks = [
    {
      name: 'Popular',
      link: '/',
    },
    {
      name: 'New',
      link: '/',
    },
    {
      name: 'Reading List',
      link: '/',
    },
    {
      name: 'Topics',
      link: '/',
    },
  ];

  ngOnInit(): void {
    this.isLoading = true;

    this.isLoggedIn = this._authService.isLoggedIn();
    if (this.isLoggedIn) {
      this._userService.user$.subscribe({
        next: (user: User) => {
          this.user = user;
          this.isLoading = false;
          // console.log(user);
        },
        error: (err) => {
          this._authService.logout();
          this.isLoading = false;
        },
      });
      // console.log(this.user);
    }
  }
  ngOnDestroy(): void {
    // console.log('navbar destroyed');
  }
}