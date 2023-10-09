import { Component, Input } from '@angular/core';
import { BlogPost } from '../Interfaces/blog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent {
  constructor(private _sanitizer: DomSanitizer, private _router: Router) {}

  @Input() blogPost!: BlogPost;

  openBlog() {
    this._router.navigate(['/post'], {
      queryParams: { id: this.blogPost._id },
    });
  }

  sanitizeImageUrl(imageUrl: string) {
    return this._sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
}
