import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DraftPost } from 'src/app/shared/Interfaces/draftPost';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  constructor(private _postService: PostService) {}

  @Input() multipleDrafts: boolean = false;
  @Output() closeDeleteModal: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @ViewChild('modalContent') modalContent!: ElementRef;
  @Output() refreshDrafts: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedDrafts!: Set<DraftPost>;

  closeModal(event: MouseEvent) {
    if (this.modalContent.nativeElement.contains(event.target)) {
      return;
    }
    this.closeDeleteModal.emit(false);
  }

  delete() {
    this._postService.deleteManyDrafts(this.selectedDrafts).subscribe({
      next: (res) => {
        // console.log(res);
        this.refreshDrafts.emit(true);
        this.closeDeleteModal.emit(false);
      },
      error: console.error,
    });
  }

  ngOnInit(): void {
    console.log(this.multipleDrafts);
  }
}
