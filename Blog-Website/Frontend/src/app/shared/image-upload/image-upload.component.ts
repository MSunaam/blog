import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UserService } from '../Services/user.service';
import { User } from '../Interfaces/user';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  constructor(private _userService: UserService) {}
  profileImagePath!: string;
  profileImage!: File;
  user!: User;
  userSubscription!: Subscription;
  @ViewChild('imageModalBody') imageModalBody!: ElementRef;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  onFileChangeEvent(event: any) {
    const file = event.target.files[0];
    this.profileImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.profileImagePath = reader.result as string;
      // console.log(this.profileImage);
    };
    reader.readAsDataURL(file);
  }

  updateProfileImage() {
    this._userService
      .uploadProfilePicture(this.profileImage, this.user.email)
      .subscribe({
        next: (user: User) => {
          this._userService.setUser(user);
          this.closeModal.emit(true);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  openImageUploadModal() {
    document.querySelector('body')?.classList.add('modal-open');
  }

  closeImageUploadModal(event: any) {
    if (this.imageModalBody.nativeElement.contains(event.target)) {
      return;
    }
    this.closeModal.emit(true);
    document.querySelector('body')?.classList.remove('modal-open');
  }

  ngOnInit(): void {
    document.querySelector('body')?.classList.add('modal-open');
    this.userSubscription = this._userService.user$.subscribe({
      next: (user: User) => {
        this.user = user;
      },
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    document.querySelector('body')?.classList.remove('modal-open');
  }
}
