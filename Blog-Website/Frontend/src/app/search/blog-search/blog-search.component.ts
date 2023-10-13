import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BlogPost } from 'src/app/shared/Interfaces/blog';

@Component({
  selector: 'app-blog-search',
  templateUrl: './blog-search.component.html',
  styleUrls: ['./blog-search.component.scss'],
})
export class BlogSearchComponent {
  constructor(private _router: Router) {}

  @Input() blogPost!: BlogPost;

  openBlog() {
    this._router.navigate(['/post'], {
      queryParams: { id: this.blogPost._id },
    });
  }

  ngOnInit(): void {}
}
