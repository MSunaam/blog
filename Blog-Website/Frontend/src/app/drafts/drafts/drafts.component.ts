import { Component, OnInit } from '@angular/core';
import { DraftPost } from 'src/app/shared/Interfaces/draftPost';
import { User } from 'src/app/shared/Interfaces/user';
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
    private _postService: PostService
  ) {}

  user!: User;
  draftPosts!: DraftPost[];

  ngOnInit(): void {
    this._userService.user$.subscribe((user) => {
      this.user = user;
    });
    this._postService.getAllDrafts(this.user._id).subscribe({
      next: (drafts) => {
        // console.log(drafts);

        this.draftPosts = drafts;
      },
    });
  }
}
