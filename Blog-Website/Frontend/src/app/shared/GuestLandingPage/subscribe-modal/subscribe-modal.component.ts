import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscribe-modal',
  templateUrl: './subscribe-modal.component.html',
  styleUrls: ['./subscribe-modal.component.scss'],
})
export class SubscribeModalComponent implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter<boolean>();
  @ViewChild('modalDialog') modalDialog!: ElementRef;
  emailErrorMessage: string = '';
  emailInvalid: boolean = false;

  subscribeForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
  });

  submitForm() {
    if (this.subscribeForm.invalid) {
      this.checkEmailError();
      return;
    }
  }

  checkModalClose(event: any) {
    if (this.modalDialog.nativeElement.contains(event.target)) {
      return;
    }
    this.closeModal.emit(true);
  }

  get emailControl() {
    return this.subscribeForm.get('email');
  }

  checkEmailError() {
    if (this.emailControl?.errors) {
      this.emailInvalid = true;
      if (this.emailControl.hasError('required')) {
        this.emailErrorMessage = 'Email is required';
      } else if (this.emailControl.hasError('email')) {
        this.emailErrorMessage = 'Email is invalid';
      }
    } else {
      this.emailInvalid = false;
      this.emailErrorMessage = '';
    }
  }

  ngOnInit(): void {
    document.querySelector('body')?.classList.add('modal-open');
    //styles.scss has rule to stop body scroll on modal-open
    this.emailControl?.valueChanges.subscribe({
      next: (value) => {
        this.checkEmailError();
      },
    });
  }
  ngOnDestroy(): void {
    document.querySelector('body')?.classList.remove('modal-open');
  }
}
