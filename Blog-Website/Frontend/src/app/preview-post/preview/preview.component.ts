import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DraftPost } from 'src/app/shared/Interfaces/draftPost';
import { User } from 'src/app/shared/Interfaces/user';
import { LoaderService } from 'src/app/shared/Services/loader.service';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  constructor(
    private _loaderService: LoaderService,
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _router: Router
  ) {}

  draftPost!: DraftPost;
  draftPostSubscription!: Subscription;
  draftpostId!: string;
  isLoading: boolean = true;
  loaderSubscription!: Subscription;
  author!: User;
  authorSubscription!: Subscription;

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  getDraftPost() {
    this._loaderService.showLoader();
    this.draftpostId = this._route.snapshot.queryParams['id'];
    if (!this.draftpostId) {
      this._router.navigate(['/write-blog']);
      this._loaderService.hideLoader();
    }
    this.draftPostSubscription = this._postService
      .getDraftById(this.draftpostId)
      .subscribe({
        next: (draft: DraftPost) => {
          this.draftPost = draft;
          this.getAuthor();
          this._loaderService.hideLoader();
        },
        error: (error) => {
          console.log(error);
          this._loaderService.hideLoader();
        },
      });
  }

  getLoaderState() {
    this.loaderSubscription = this._loaderService.getLoader().subscribe({
      next: (loading) => {
        // console.log(loading);

        setTimeout(() => {
          this.isLoading = loading;
        });
      },
    });
  }

  getAuthor() {
    this._loaderService.showLoader();
    this.authorSubscription = this._postService
      .getDraftAuthor(this.draftPost.author)
      .subscribe({
        next: (author: User) => {
          this.author = author;
          this._loaderService.hideLoader();
        },
        error: (error) => {
          console.log(error);
          this._loaderService.hideLoader();
        },
      });
  }

  editPost() {
    this._router.navigate(['/write-blog'], {
      queryParams: { id: this.draftPost._id },
    });
  }

  ngOnInit(): void {
    this.getDraftPost();
    this.getLoaderState();
  }

  ngOnDestroy(): void {
    this.draftPostSubscription.unsubscribe();
    this.loaderSubscription.unsubscribe();
    this.authorSubscription.unsubscribe();
  }
}
