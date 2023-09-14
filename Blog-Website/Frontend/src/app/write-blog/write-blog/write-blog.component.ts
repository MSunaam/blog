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

  leadImage!: File;
  leadImageFile!: string;

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
    this._postService.saveDraftPost(this.newBlog).subscribe({
      next: (post) => {
        console.log(post);
      },
      error: console.error,
    });
  }

  onFileChangeEvent(event: any) {
    const file = event.target.files[0];
    this.leadImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.leadImageFile = reader.result as string;
      // console.log(this.profileImage);
    };
    reader.readAsDataURL(file);
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
    this._router.navigate(['/post'], { queryParams: { preview: true } });
  }

  ngOnInit(): void {
    this.newBlog = emptyPost(this.currentUser);
    this.newBlog.publishDate = new Date().toISOString();

    this._userService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
        // this.newBlog = emptyPost(user);
      },
    });

    this._postService.getPreviewPost(this.currentUser._id).subscribe({
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
