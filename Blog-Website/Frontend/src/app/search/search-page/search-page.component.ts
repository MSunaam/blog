import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { LoaderService } from 'src/app/shared/Services/loader.service';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit, OnDestroy {
  constructor(
    private _postService: PostService,
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _loader: LoaderService
  ) {}

  searchControlChangesSubscription!: Subscription;
  searchResultsSubscription!: Subscription;

  searchResults: BlogPost[] = [];

  totalPages!: number;
  currentPage!: number;
  pageSize!: number;
  count!: number;
  pageNumbers: number[] = [];

  searchControl = new FormControl('');

  sanitizeUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getPosts(query: string, pageNumber: number = 1) {
    pageNumber = pageNumber - 1;
    this._loader.showLoader();

    this.searchResultsSubscription = this._postService
      .getPosts(query, pageNumber)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this._loader.hideLoader();
          window.scrollTo(0, 0);
          this.searchResults = res.posts;
          this.totalPages = res.totalPages;
          this.currentPage = res.currentPage;
          this.pageSize = res.pageSize;
          this.count = res.count;
          this.pageNumbers = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );
        },
        error: (err) => {
          console.log(err);

          this._loader.hideLoader();
        },
      });
  }

  getSearchControlChanges() {
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe({
        next: (value) => {
          if (value) {
            if (value?.trim() !== '') {
              this.getPosts(value);
              return;
            }
          }
          this.searchResults = [];
        },
      });
  }

  getRouteParams() {
    const search = this._route.snapshot.queryParams['search'];

    if (search) {
      this.searchControl.setValue(search);
      this.getPosts(search);
    }
  }

  ngOnInit(): void {
    this.getSearchControlChanges();
    this.getRouteParams();
  }
  ngOnDestroy(): void {
    // this.searchControlChangesSubscription.unsubscribe();
    // this.searchResultsSubscription.unsubscribe();
  }
}
