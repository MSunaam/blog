import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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

  isDraftPostEmpty() {
    return this.newBlog === emptyPost(this.currentUser);
  }

  createNewDarft() {
    console.log(this.newBlog);

    this._postService.saveDraftPost(this.newBlog).subscribe({
      next: (res) => {
        this.newBlog = emptyPost(this.currentUser);
      },
      error: console.error,
    });
  }

  saveChangesLoader: boolean = false;

  isLeadImageModalOpen: boolean = false;

  openLeadImageModal() {
    this.isLeadImageModalOpen = true;
  }

  closeLeadImageModal(event: boolean) {
    this.isLeadImageModalOpen = false;
  }

  editorConfig = {
    handlers: {
      link: function (value: string) {
        if (value) {
          var href = prompt('Enter the URL');
        }
      },
    },
  };

  leadImageControl = new FormControl();

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

  saveDraftPost() {
    this.saveChangesLoader = true;
    this._postService.saveDraftPost(this.newBlog).subscribe({
      next: (post) => {
        // console.log(post);
        setTimeout(() => {
          this.saveChangesLoader = false;
        }, 1000);
      },
      error: console.error,
    });
  }

  openCancelPostModal() {
    this.isCancelPostModalOpen = true;
  }

  closeCancelPostModal() {
    this.isCancelPostModalOpen = false;
  }

  previewBlogPost() {
    // return;

    this._postService.setPreviewPost(this.newBlog);
    this._router.navigate(['/post'], {
      queryParams: { preview: true, id: this.newBlog._id },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.newBlogPostForm.valueChanges
      .pipe(debounceTime(3000), distinctUntilChanged())
      .subscribe((value) => {
        this._postService.saveDraftPost(this.newBlog).subscribe({
          next: (post) => {
            // console.log(post);
          },
          error: console.error,
        });
      });

    this.newBlog = emptyPost(this.currentUser);
    this.newBlog.publishDate = new Date().toISOString();

    this._userService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
        // this.newBlog = emptyPost(user);
      },
    });

    this._postService.getLatestDraftPost(this.currentUser._id).subscribe({
      next: (post: BlogPost | null) => {
        // console.log(post);

        if (!post) return;

        this.newBlog = post;
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
  }
}
