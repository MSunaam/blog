import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
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
    private _sanitizer: DomSanitizer
  ) {}

  id!: string;
  publicUser!: User;
  isPreview: boolean = false;
  blogPosts: BlogPost[] = [];

  getUserBlogPosts() {
    this._userService.getUserBlogPosts(this.id).subscribe({
      next: (blogPosts) => {
        this.blogPosts = blogPosts;
      },
      error: console.error,
    });
  }

  getPublicUser() {
    this._userService.getUserByIdPublic(this.id).subscribe({
      next: (user) => {
        this.publicUser = user;
        // console.log(user);
        // this.getUserBlogPosts();

        this.publicUser.bio = this.publicUser.bio
          .replace(/<[^>]*>/g, '')
          .trim();
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

  ngOnInit(): void {
    initTE({ Tooltip });

    this.getRouteInfo(); //get id of user and preview status

    this.getPublicUser(); //get public user
    this.getUserBlogPosts(); //get user blog posts
  }
}
