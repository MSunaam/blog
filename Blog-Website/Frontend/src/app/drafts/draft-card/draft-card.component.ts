import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DraftPost } from 'src/app/shared/Interfaces/draftPost';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-draft-card',
  templateUrl: './draft-card.component.html',
  styleUrls: ['./draft-card.component.scss'],
})
export class DraftCardComponent implements OnInit {
  constructor(private _router: Router, private _postService: PostService) {}

  @Input() draftPost!: DraftPost;

  openDraft() {
    this._router.navigate(['/write-blog'], {
      queryParams: { id: this.draftPost._id },
    });
  }

  ngOnInit(): void {}
}
