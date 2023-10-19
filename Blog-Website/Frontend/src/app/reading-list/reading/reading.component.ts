import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import {
  ReadingList,
  readingList,
} from 'src/app/shared/Interfaces/readingLists';
import { LoaderService } from 'src/app/shared/Services/loader.service';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
})
export class ReadingComponent implements OnInit, OnDestroy {
  constructor(
    private _postService: PostService,
    private _loaderService: LoaderService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  readingListName!: ReadingList;
  blogPosts: BlogPost[] = [];

  getRouteParams() {
    const listName = this._route.snapshot.queryParamMap.get('list')!;
    readingList.filter((list) => {
      if (list.title === listName) {
        this.readingListName = list;
        this.getReadingList();
      }
    });
    if (!this.readingListName) {
      this._router.navigate(['/home']);
    }
    console.log(JSON.stringify(this.readingListName));
  }

  getReadingList() {
    this._postService
      .getPostByCategory(this.readingListName.title.toUpperCase())
      .subscribe({
        next: (res) => {
          console.log(res);
          this.blogPosts = res;
          this._loaderService.hideLoader();
        },
        error: (err) => {
          console.log(err);
          this._loaderService.hideLoader();
        },
      });
  }

  ngOnInit(): void {
    this._loaderService.showLoader();
    this.getRouteParams();
  }

  ngOnDestroy(): void {}
}
