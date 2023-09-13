import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { User } from 'src/app/shared/Interfaces/user';
import { PostService } from 'src/app/shared/Services/post.service';
import { UserService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _userService: UserService,
    private _router: Router
  ) {}

  //if preview is true
  @Input() previewBlogPost!: BlogPost;
  isPreview: boolean = false;

  isLoading: boolean = true;
  postServiceSubscription!: Subscription;
  userServiceSubscription!: Subscription;
  blogPost!: BlogPost;
  blogPostId!: string;

  loggedInUser!: User;
  loggedInUserSubscription!: Subscription;

  allowEdit: boolean = false;

  editPost() {
    if (this.isPreview) {
      this._postService.setPreviewPost(this.blogPost);
      this._router.navigate(['/write-blog']);
    }
  }

  checkAllowEdit() {
    if (this.loggedInUser._id === this.blogPost.author._id) {
      this.allowEdit = true;
    }
  }

  checkBlogLiked() {
    this.loggedInUser.likedPosts.forEach((post) => {
      // console.log(post);
      // console.log(this.blogPostId);

      if (post === this.blogPostId) {
        this.liked = true;
      }
    });
  }

  getBlogPost() {
    this.isLoading = true;
    this.blogPostId = this._route.snapshot.queryParams['id'];
    this.isPreview = this._route.snapshot.queryParams['preview'];

    if (this.isPreview) {
      this._postService.getPreviewPost(this.blogPostId).subscribe({
        next: (post: BlogPost | null) => {
          // console.log(post);
          if (!post) {
            this._router.navigate(['/write-blog']);
            return;
          }
          this.blogPost = post;
          this.isLoading = false;
          this.checkAllowEdit();
          this.checkBlogLiked();
        },
        error: console.error,
      });
      return;
    }
    this.postServiceSubscription = this._postService
      .getBlogPost(this.blogPostId)
      .subscribe({
        next: (post: BlogPost) => {
          this.blogPost = post;
          this.isLoading = false;
          this.checkAllowEdit();
          this.checkBlogLiked();
          // setTimeout(() => {
          //   this.isLoading = false;
          // }, 1000);
        },
        error: console.error,
      });
  }

  getLoggedInUser() {
    this.userServiceSubscription = this.loggedInUserSubscription =
      this._userService.user$.subscribe({
        next: (user: User) => {
          this.loggedInUser = user;
          // console.log(this.loggedInUser);
        },
        error: console.error,
      });
    this._userService.refreshLoggedInUser();
  }

  likeBlogPost() {
    this._postService
      .likeBlogPost(this.loggedInUser._id, this.blogPostId)
      .subscribe({
        next: (res) => {
          // console.log(res);

          this.blogPost = res.blogPost;
          this.loggedInUser = res.user;
          this.liked = true;
          this._userService.setUser(this.loggedInUser);
        },
        error: console.error,
      });
  }

  unlikeBlogPost() {
    this._postService
      .unlikeBlogPost(this.loggedInUser._id, this.blogPostId)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.blogPost = res.blogPost;
          this.loggedInUser = res.user;
          this.liked = false;
          this._userService.setUser(this.loggedInUser);
        },
        error: console.error,
      });
  }

  liked: boolean = false;

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.getBlogPost();
  }
  ngOnDestroy(): void {
    // this.postServiceSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
  }
}
