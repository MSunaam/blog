import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
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
    private _route: ActivatedRoute
  ) {}

  searchControlChangesSubscription!: Subscription;
  searchResultsSubscription!: Subscription;

  searchResults: BlogPost[] = [];

  searchControl = new FormControl('');

  sanitizeUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getPosts(query: string) {
    this.searchResultsSubscription = this._postService
      .getPosts(query)
      .subscribe({
        next: (res) => {
          this.searchResults = res;
        },
        error: console.error,
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