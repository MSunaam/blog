import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { GuestPageService } from 'src/app/shared/Services/guest-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements AfterViewInit, OnInit {
  constructor(
    private _guestPageService: GuestPageService,
    private _authService: AuthenticationService,
    private _sanitizer: DomSanitizer
  ) {}

  isModalClosed: boolean = true;

  blogDetails: BlogPost[] = [];

  scrollLeftAmount: number = 220;

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  closeSubscribeModal(close: boolean = false) {
    if (close) {
      this.isModalClosed = true;
    }
  }

  scrollLeft() {
    document.getElementById('readingList')!.scrollBy({
      left: -this.scrollLeftAmount,
      behavior: 'smooth',
    });
  }
  scrollRight() {
    document.getElementById('readingList')!.scrollBy({
      left: this.scrollLeftAmount,
      behavior: 'smooth',
    });
  }
  ngAfterViewInit() {
    document.getElementById('readingList')!.scrollTo({
      left: 0,
    });
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
  }
}
