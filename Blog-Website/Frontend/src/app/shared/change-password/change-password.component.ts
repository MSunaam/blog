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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../Interfaces/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  constructor(private _userService: UserService) {}

  @Input() user!: User;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('changePasswordModalBody') changePasswordModalBody!: ElementRef;

  @ViewChild('oldPasswordInput') oldPasswordInput!: ElementRef;
  @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  blurInputs() {
    this.oldPasswordInput.nativeElement.blur();
    this.newPasswordInput.nativeElement.blur();
    this.confirmPasswordInput.nativeElement.blur();
  }

  isChangePasswordModalOpen: boolean = false;

  confirmPasswordError: string = '';
  oldPasswordError: string = '';
  newPasswordError: string = '';

  formInvalid: boolean = true;

  passwordChanged: boolean = false;

  passwordError: boolean = false;
  passwordErrorMessage: string = '';

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'blur',
    }),
    newPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'blur',
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'blur',
    }),
  });

  get oldPasswordControl() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPasswordControl() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.changePasswordForm.get('confirmPassword');
  }

  checkOldPassword() {
    const oldPassword = this.oldPasswordControl?.value!;
    if (oldPassword.length < 8) {
      this.oldPasswordError = 'Password must be at least 8 characters';
      this.formInvalid = true;
    } else {
      this.oldPasswordError = '';
      this.formInvalid = false;
    }
  }

  checkNewPassword() {
    const newPassword = this.newPasswordControl?.value!;
    if (newPassword.length < 8) {
      this.newPasswordError = 'Password must be at least 8 characters';
      this.formInvalid = true;
    } else {
      this.newPasswordError = '';
      this.formInvalid = false;
    }
  }

  checkConfirmPassword() {
    const newPassword = this.newPasswordControl?.value!;
    const confirmPassword = this.confirmPasswordControl?.value!;
    if (newPassword !== confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      this.formInvalid = true;
    } else {
      this.confirmPasswordError = '';
      this.formInvalid = false;
    }
  }

  changePassword() {
    this.checkConfirmPassword();
    this.checkNewPassword();
    this.checkOldPassword();

    // console.log(this.formInvalid);

    if (this.formInvalid) return;

    const oldPassword = this.oldPasswordControl?.value!;
    const newPassword = this.newPasswordControl?.value!;

    this._userService
      .changePassword(oldPassword, newPassword, this.user._id)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.passwordChanged = true;

          setTimeout(() => {
            this.closeChangePasswordModal();
            this.passwordChanged = false;
          }, 1000);
        },
        error: (err) => {
          // console.log(err);
          this.passwordError = true;
          this.passwordErrorMessage = err.error.message;
          setTimeout(() => {
            this.passwordError = false;
            this.passwordErrorMessage = '';
          }, 3000);
        },
      });
  }

  openChangePasswordModal() {
    this.isChangePasswordModalOpen = true;
    document.querySelector('body')?.classList.add('modal-open');
  }

  closeChangePasswordModalClick(event: MouseEvent) {
    if (!this.changePasswordModalBody.nativeElement.contains(event.target)) {
      this.isChangePasswordModalOpen = false;
      document.querySelector('body')?.classList.remove('modal-open');
      this.closeModal.emit(false);
    }
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
    this.closeModal.emit(false);
  }

  ngOnInit(): void {
    // console.log(this.user);

    this.newPasswordControl?.valueChanges.subscribe({
      next: (value) => {
        this.checkNewPassword();
      },
      error: console.error,
    });
    this.confirmPasswordControl?.valueChanges.subscribe({
      next: (value) => {
        this.checkConfirmPassword();
      },
    });
    this.oldPasswordControl?.valueChanges.subscribe({
      next: (value) => {
        // console.log(value);

        this.checkOldPassword();
      },
    });
  }
  ngOnDestroy(): void {}
}
