import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DraftPost } from 'src/app/shared/Interfaces/draftPost';
import { PostService } from 'src/app/shared/Services/post.service';

@Component({
  selector: 'app-save-lead-image',
  templateUrl: './save-lead-image.component.html',
  styleUrls: ['./save-lead-image.component.scss'],
})
export class SaveLeadImageComponent implements OnInit, OnDestroy {
  constructor(
    private _sanitizer: DomSanitizer,
    private _postService: PostService
  ) {}

  leadImage!: File;
  leadImageFile!: string;
  isFileSelected: boolean = false;

  showRemoveImageModal: boolean = false;

  openRemoveImageModal() {
    this.showRemoveImageModal = true;
  }

  @ViewChild('modalContent') modalContent!: ElementRef;

  @Input() draftPost!: DraftPost;

  @Output() isModalClosed = new EventEmitter<boolean>();

  sanitizeUrls(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  onFileChangeEvent(event: any) {
    const file = event.target.files[0];
    this.leadImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.leadImageFile = reader.result as string;
      this.isFileSelected = true;
    };
    reader.readAsDataURL(file);
  }

  uploadFile() {
    this._postService
      .uploadLeadImage(this.leadImage, this.draftPost._id!)
      .subscribe({
        next: (draftPost: DraftPost) => {
          // console.log(draftPost);
          this.isModalClosed.emit(true);
        },
        error: (err) => {
          alert(JSON.stringify(err));
          console.log(err);
        },
      });
  }

  closeModal(event: MouseEvent) {
    // console.log(this.modalContent.nativeElement.contains(event.target));

    if (this.modalContent.nativeElement.contains(event.target)) {
      return;
    }
    this.isModalClosed.emit(true);
  }

  ngOnInit(): void {
    document.querySelector('body')?.classList.add('modal-open');
    console.log(this.draftPost);
  }

  ngOnDestroy(): void {
    document.querySelector('body')?.classList.remove('modal-open');
  }
}
