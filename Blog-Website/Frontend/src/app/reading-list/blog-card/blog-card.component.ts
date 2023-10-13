import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { LoaderService } from 'src/app/shared/Services/loader.service';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-blog-card-list',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent implements OnInit, OnDestroy {
  constructor(
    private _loader: LoaderService,
    private _postService: PostService,
    private _sanitizer: DomSanitizer
  ) {}

  @Input() blogPost!: BlogPost;

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
