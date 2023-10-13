import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { PublicProfile } from 'src/app/shared/Interfaces/publicUser.interface';
import { User } from 'src/app/shared/Interfaces/user';
import { UserService } from 'src/app/shared/Services/user.service';
import { Tooltip, initTE } from 'tw-elements';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _sanitizer: DomSanitizer,
    private _router: Router
  ) {}

  id!: string;
  publicUser!: PublicProfile;
  isPreview: boolean = false;
  blogPosts: BlogPost[] = [];

  user!: User;

  follow() {
    if (this.publicUser.isFollowing || this.isPreview) return;
    this._userService
      .followUser(this.user.email, this.publicUser.email)
      .subscribe({
        next: (user) => {
          // this.publicUser = user;
          this.getPublicUser();
        },
        error: console.error,
      });
  }

  unfollow() {
    if (!this.publicUser.isFollowing || this.isPreview) return;
    this._userService
      .unfollowUser(this.user.email, this.publicUser.email)
      .subscribe({
        next: (user) => {
          // this.publicUser = user;
          this.getPublicUser();
        },
        error: console.error,
      });
  }

  getUserBlogPosts() {
    this._userService.getUserBlogPosts(this.id).subscribe({
      next: (blogPosts) => {
        this.blogPosts = blogPosts;
      },
      error: console.error,
    });
  }

  getPublicUser() {
    // if (!this.user) return;
    this._userService.getUserByIdPublic(this.id, this.user.email).subscribe({
      next: (user) => {
        this.publicUser = user;
        this.publicUser.bio = this.publicUser.bio
          .replace(/<[^>]*>/g, '')
          .trim();
        if (!this.user) return;
        if (this.publicUser.email === this.user.email) {
          this.isPreview = true;
          this._router.navigate(['/user/public'], {
            queryParams: { id: this.user._id, preview: true },
          });
        }
        // console.log(user);
        // console.log(this.publicUser);

        // this.getUserBlogPosts();
      },
      error: console.error,
    });
  }

  getRouteInfo() {
    this.id = this._route.snapshot.queryParams['id'];
    this.isPreview = this._route.snapshot.queryParams['preview'];
  }

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (user) => {
        this.user = user;
      },
      error: console.error,
    });
  }

  ngOnInit(): void {
    initTE({ Tooltip });
    this.getUser(); //get logged in user
    this.getRouteInfo(); //get id of user and preview status

    this.getPublicUser(); //get public user
    this.getUserBlogPosts(); //get user blog posts
  }
}
