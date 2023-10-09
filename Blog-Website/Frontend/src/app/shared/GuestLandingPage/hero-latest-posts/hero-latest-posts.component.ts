import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BlogPost } from '../../Interfaces/blog';
import { DomSanitizer } from '@angular/platform-browser';
import { BlogCategory } from '../../Interfaces/BlogCategory.eum';

@Component({
  selector: 'app-hero-latest-posts',
  templateUrl: './hero-latest-posts.component.html',
  styleUrls: ['./hero-latest-posts.component.scss'],
})
export class HeroLatestPostsComponent implements OnInit, OnChanges {
  constructor(private _domSanitizer: DomSanitizer) {}

  @Input() blogDetails!: BlogPost[];
  mostRecentBlog!: BlogPost;
  blogCategory!: BlogCategory;

  blogClicked(blog: BlogPost) {
    this.blogDetails.push(this.mostRecentBlog);
    this.mostRecentBlog = blog;
    this.blogDetails = this.blogDetails.filter((blog) => {
      return blog._id !== this.mostRecentBlog._id;
    });
  }

  sanitizeImageUrl(imageUrl: string) {
    return this._domSanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  ngOnInit(): void {
    this.mostRecentBlog = this.blogDetails.shift()!;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.mostRecentBlog = this.blogDetails.shift()!;
    // console.log(this.blogDetails);
  }
}
