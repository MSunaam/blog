import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { BlogPost, emptyPost } from 'src/app/shared/Interfaces/blog';
import { User } from 'src/app/shared/Interfaces/user';
import { PostService } from 'src/app/shared/Services/post.service';
import { UserService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.scss'],
})
export class WriteBlogComponent implements OnInit {
  constructor(
    private _titleService: Title,
    private _userService: UserService,
    private _postService: PostService,
    private _router: Router
  ) {}

  editorConfig = {
    handlers: {
      link: function (value: string) {
        if (value) {
          var href = prompt('Enter the URL');
        }
      },
    },
  };

  newBlogPostForm = new FormGroup({
    titleInput: new FormControl(),
    summaryInput: new FormControl(),
    blogContentControl: new FormControl(),
  });

  newBlog!: BlogPost;
  currentUser!: User;

  get titleInput() {
    return this.newBlogPostForm.get('titleInput');
  }

  get summaryInput() {
    return this.newBlogPostForm.get('summaryInput');
  }

  get blogContentControl() {
    return this.newBlogPostForm.get('blogContentControl');
  }

  isCancelPostModalOpen: boolean = false;

  openCancelPostModal() {
    this.isCancelPostModalOpen = true;
  }

  closeCancelPostModal() {
    this.isCancelPostModalOpen = false;
  }

  previewBlogPost() {
    // return;

    this._postService.setPreviewPost(this.newBlog);
    this._router.navigate(['/post'], { queryParams: { preview: true } });
  }

  ngOnInit(): void {
    this._userService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
        // this.newBlog = emptyPost(user);
      },
    });

    this._postService.getPreviewPost().subscribe({
      next: (post) => {
        this.newBlog = post;
        // console.log(this.newBlog);
        this.newBlogPostForm.patchValue(
          {
            titleInput: this.newBlog.title,
            summaryInput: this.newBlog.summary,
            blogContentControl: this.newBlog.content,
          },
          { emitEvent: false }
        );
      },
    });

    this._titleService.setTitle('Write Blog');
    this.titleInput!.valueChanges.pipe(distinctUntilChanged()).subscribe(
      (value) => {
        // console.log(value);

        this._titleService.setTitle(value);
        this.newBlog.title = value;
      }
    );
    this.summaryInput!.valueChanges.pipe(distinctUntilChanged()).subscribe(
      (value) => {
        this.newBlog.summary = value;
        // console.log(value);
      }
    );
    this.blogContentControl!.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((value) => {
      this.newBlog.content = value;
    });

    this.newBlog.publishDate = new Date().toISOString();
  }
}
