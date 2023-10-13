import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { GuestPageService } from 'src/app/shared/Services/guest-page.service';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  constructor(
    private _guestPageService: GuestPageService,
    private _authService: AuthenticationService,
    private _sanitizer: DomSanitizer,
    private _postService: PostService
  ) {}

  isModalClosed: boolean = true;

  blogDetails: BlogPost[] = [];

  popularPosts: BlogPost[] = [];
  randomPost: BlogPost[] = [];

  getPopularPosts() {
    this._postService.getPopular().subscribe({
      next: (res) => {
        this.popularPosts = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRandomPost() {
    this._postService.getRandom().subscribe({
      next: (res) => {
        this.randomPost = res;
        // console.log(this.randomPost[0].author);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  closeSubscribeModal(close: boolean = false) {
    if (close) {
      this.isModalClosed = true;
    }
  }
  async ngOnInit() {
    await lastValueFrom(this._guestPageService.getLatestPosts())
      .then((blogPosts) => {
        this.blogDetails = blogPosts;
        // console.log(this.blogDetails);
      })
      .catch((err) => {
        console.log(err);
      });
    if (!this._authService.isLoggedIn()) {
      this.isModalClosed = false;
    }
    this.getPopularPosts();
    this.getRandomPost();
  }
}
