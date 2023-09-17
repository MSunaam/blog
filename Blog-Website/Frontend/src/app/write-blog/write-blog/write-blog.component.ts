import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BlogPost } from 'src/app/shared/Interfaces/blog';
import { DraftPost, newDraftPost } from 'src/app/shared/Interfaces/draftPost';
import { User } from 'src/app/shared/Interfaces/user';
import { LoaderService } from 'src/app/shared/Services/loader.service';
import { PostService } from 'src/app/shared/Services/post.service';
import { UserService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.scss'],
})
export class WriteBlogComponent implements OnInit, OnDestroy {
  constructor(
    private _titleService: Title,
    private _userService: UserService,
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _loaderService: LoaderService,
    private _sanitizer: DomSanitizer,
    private _router: Router
  ) {}

  draftId!: string;

  loggedInUserSubscription!: Subscription;
  saveDraftSubscription!: Subscription;
  titleChangeSubscription!: Subscription;
  summaryChangeSubscription!: Subscription;
  contentChangeSubscription!: Subscription;

  leadImageControl = new FormControl();

  newBlogPostForm = new FormGroup({
    titleInputControl: new FormControl(),
    summaryInputControl: new FormControl(),
    blogContentControl: new FormControl(),
  });

  newDraft!: DraftPost;
  currentUser!: User;

  saveChangesLoader: boolean = false;
  isCancelPostModalOpen: boolean = false;
  isLeadImageModalOpen: boolean = false;

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  removeLeadImage() {
    this.newDraft.leadImage = '';
    this.leadImageControl.setValue('');
    this.saveDraftPost();
  }

  createNewDarft() {
    console.log(this.newDraft);

    if (!this.checkIfNewDraftEmpty()) {
      console.log('not empty');

      this.saveDraftPost();
    }
    this.newDraft = newDraftPost(this.currentUser);
    this.newBlogPostForm.reset({}, { emitEvent: false });
  }

  openLeadImageModal() {
    this.isLeadImageModalOpen = true;
  }

  closeLeadImageModal(event: boolean) {
    this.isLeadImageModalOpen = false;
    this.getRouteData();
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

  get titleInputControl() {
    return this.newBlogPostForm.get('titleInputControl');
  }

  get summaryInputControl() {
    return this.newBlogPostForm.get('summaryInputControl');
  }

  get blogContentControl() {
    return this.newBlogPostForm.get('blogContentControl');
  }

  saveDraftPost() {
    if (this.checkIfNewDraftEmpty()) return;
    this.saveChangesLoader = true;
    this._postService.saveDraftPost(this.newDraft).subscribe({
      next: (post) => {
        console.log(post);
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
    // this._postService.setPreviewPost(this.newBlog);
    // this._router.navigate(['/post'], {
    //   queryParams: { preview: true, id: this.newBlog._id },
    //   queryParamsHandling: 'merge',
    // });
    this._router.navigate(['/preview'], {
      queryParams: { id: this.newDraft._id },
    });
  }

  getLoggedInUser() {
    this.loggedInUserSubscription = this._userService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
    });
  }

  checkIfNewDraftEmpty() {
    return (
      this.newDraft.title.trim() === '' &&
      (this.newDraft.content === null || this.newDraft.content.trim() == '') &&
      this.newDraft.summary.trim() === ''
    );
  }

  saveOnFormChange() {
    this.saveDraftSubscription = this.newBlogPostForm.valueChanges
      .pipe(debounceTime(3000), distinctUntilChanged())
      .subscribe((value) => {
        if (this.checkIfNewDraftEmpty()) {
          // console.log('empty');

          return;
        }
        // console.log('not empty');
        // console.log(this.newDraft);

        this.saveDraftPost();
      });
  }

  titleUpdateSubscription() {
    this._titleService.setTitle('New Blog');
    this.titleChangeSubscription = this.titleInputControl!.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000)
    ).subscribe((value) => {
      // console.log(value);

      this._titleService.setTitle(`${value} - New Blog`);
      this.newDraft.title = value;
    });
  }

  controlUpdateSubscription() {
    this.summaryChangeSubscription =
      this.summaryInputControl!.valueChanges.pipe(
        distinctUntilChanged()
      ).subscribe((value) => {
        // console.log(value);

        this.newDraft.summary = value;
        // console.log(value);
      });
    this.contentChangeSubscription = this.blogContentControl!.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((value) => {
      // console.log(value);

      this.newDraft.content = value;
    });
  }

  getRouteData() {
    this._loaderService.showLoader();
    this.draftId = this._route.snapshot.queryParams['id'];
    if (!this.draftId) {
      this._loaderService.hideLoader();
      return;
    } else {
      // console.log(this.draftId);

      this._postService.getDraftById(this.draftId).subscribe({
        next: (draft: DraftPost) => {
          this.newDraft = draft;
          this.newBlogPostForm.patchValue(
            {
              titleInputControl: draft.title,
              summaryInputControl: draft.summary,
              blogContentControl: draft.content,
            },
            { emitEvent: false }
          );
          this.leadImageControl.setValue(draft.leadImage);
          this._loaderService.hideLoader();
        },
        error: console.error,
      });
    }
  }

  getLatestDraft() {
    this._postService.getLatestDraft(this.currentUser._id).subscribe({
      next: (draft) => {
        // console.log(draft);
        this.newDraft = draft;
      },
      error: console.error,
    });
  }

  ngOnInit(): void {
    this._loaderService.showLoader();
    this.getLoggedInUser();

    this.newDraft = newDraftPost(this.currentUser);

    this.newDraft.lastUpdated = new Date().toISOString();
    // console.log(this.newDraft);

    this.saveOnFormChange();

    this.titleUpdateSubscription();
    this.controlUpdateSubscription();
    this.getRouteData();
    this._loaderService.hideLoader();
  }

  ngOnDestroy(): void {
    this.loggedInUserSubscription.unsubscribe();
    this.saveDraftSubscription.unsubscribe();
    this.titleChangeSubscription.unsubscribe();
    this.contentChangeSubscription.unsubscribe();
    this.summaryChangeSubscription.unsubscribe();
  }
}
