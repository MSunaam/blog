import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { DraftPost } from 'src/app/shared/Interfaces/draftPost';
import { User } from 'src/app/shared/Interfaces/user';
import { LoaderService } from 'src/app/shared/Services/loader.service';
import { PostService } from 'src/app/shared/Services/post.service';
import { UserService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss'],
})
export class DraftsComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private _loaderService: LoaderService,
    private _router: Router
  ) {}

  user!: User;
  draftPosts: DraftPost[] = [];
  selectedDrafts: Set<DraftPost> = new Set<DraftPost>();

  showDeleteModal: boolean = false;

  @ViewChildren('checkBox') checkBoxes!: QueryList<ElementRef>;
  @ViewChild('selectAllInput') selectAllInput!: ElementRef;

  deleteDrafts() {
    // console.log(this.selectedDrafts);
    // this._postService.deleteManyDrafts(this.selectedDrafts).subscribe({
    //   next: (res) => {
    //     // console.log(res);
    //     this.getAllDrafts();
    //   },
    //   error: console.error,
    // });
    this.showDeleteModal = true;
  }

  refreshDrafts(event: boolean) {
    if (event) {
      this.getAllDrafts();
    }
  }

  closeDeleteModal(event: boolean) {
    this.showDeleteModal = false;
  }

  addToSet(event: any, draft: DraftPost) {
    if (event.target.checked) {
      this.selectedDrafts.add(draft);
      if (this.selectedDrafts.size === this.draftPosts.length) {
        this.selectAllInput.nativeElement.checked = true;
      }
    } else {
      this.selectedDrafts.delete(draft);
      this.selectAllInput.nativeElement.checked = false;
    }
  }

  addAllToSet(event: any) {
    if (event.target.checked) {
      this.checkBoxes.forEach((checkbox) => {
        checkbox.nativeElement.checked = true;
      });
      this.draftPosts.forEach((draft) => {
        this.selectedDrafts.add(draft);
      });
    } else {
      this.checkBoxes.forEach((checkbox) => {
        checkbox.nativeElement.checked = false;
      });
      this.selectedDrafts.clear();
    }
    // console.log(this.selectedDrafts);
  }

  checkIfAnySelected() {
    return this.selectedDrafts.size > 0;
  }

  newPost() {
    this._router.navigate(['/write-blog'], { queryParams: { id: '' } });
  }

  getAllDrafts() {
    this._postService.getAllDrafts(this.user._id).subscribe({
      next: (drafts) => {
        // console.log(drafts);

        this.draftPosts = drafts;
        this._loaderService.hideLoader();
      },
    });
  }

  ngOnInit(): void {
    this._loaderService.showLoader();
    this._userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.getAllDrafts();
  }
}
