import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-save-lead-image',
  templateUrl: './save-lead-image.component.html',
  styleUrls: ['./save-lead-image.component.scss'],
})
export class SaveLeadImageComponent implements OnInit, OnDestroy {
  constructor() {}

  leadImage!: File;
  leadImageFile!: string;

  @ViewChild('modalContent') modalContent!: ElementRef;

  @Output() isModalClosed = new EventEmitter<boolean>();

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

  closeModal(event: MouseEvent) {
    // console.log(this.modalContent.nativeElement.contains(event.target));

    if (this.modalContent.nativeElement.contains(event.target)) {
      return;
    }
    this.isModalClosed.emit(true);
  }

  ngOnInit(): void {
    document.querySelector('body')?.classList.add('modal-open');
  }

  ngOnDestroy(): void {
    document.querySelector('body')?.classList.remove('modal-open');
  }
}
