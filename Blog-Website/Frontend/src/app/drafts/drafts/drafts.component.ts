import { Component, OnInit } from '@angular/core';
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
  draftPosts!: DraftPost[];

  newPost() {
    this._router.navigate(['/write-blog'], { queryParams: { id: '' } });
  }

  ngOnInit(): void {
    this._loaderService.showLoader();
    this._userService.user$.subscribe((user) => {
      this.user = user;
    });
    this._postService.getAllDrafts(this.user._id).subscribe({
      next: (drafts) => {
        // console.log(drafts);

        this.draftPosts = drafts;
        this._loaderService.hideLoader();
      },
    });
  }
}
