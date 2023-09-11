import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { SignInRes } from 'src/app/shared/Interfaces/signInRes.interface';
import { UserService } from 'src/app/shared/Services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
    private _userService: UserService
  ) {}

  emailErrorMessages: string = '';
  passwordErrorMessages: string = '';
  authError: boolean = false;
  authErrorsMessage: string = '';
  isSigningIn: boolean = false;

  signInForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)],
      updateOn: 'blur',
    }),
  });

  signin() {
    if (this.signInForm.invalid) {
      this.checkEmailErrors();
      this.checkPasswordErrors();
      return;
    }

    this.isSigningIn = true;

    const { email, password } = this.signInForm.value;

    this._authService.signin(email!, password!).subscribe({
      next: (res: SignInRes) => {
        this.isSigningIn = false;
        // console.log(res);
        this._authService.storeUserAndToken(res);
        this._userService.setUser(res.user);
        this._router.navigate(['/home']);
      },
      error: (error) => {
        this.isSigningIn = false;
        this.authErrorsMessage = error.message;
        this.authError = true;
        setTimeout(() => {
          this.authErrorsMessage = '';
          this.authError = false;
        }, 5000);
      },
    });
  }

  get emailControl() {
    return this.signInForm.get('email');
  }

  get passwordControl() {
    return this.signInForm.get('password');
  }

  checkEmailErrors() {
    if (this.emailControl?.errors) {
      document.getElementById('email')?.classList.add('invalidInput');
      document.getElementById('emailLabel')?.classList.add('invalidLabel');
      if (this.emailControl?.hasError('required')) {
        this.emailErrorMessages = 'Email is required';
      } else if (this.emailControl?.hasError('email')) {
        this.emailErrorMessages = 'Email is invalid';
      }
    } else {
      document.getElementById('email')?.classList.remove('invalidInput');
      document.getElementById('emailLabel')?.classList.remove('invalidLabel');
      this.emailErrorMessages = '';
    }
  }

  checkPasswordErrors() {
    if (this.passwordControl?.errors) {
      document.getElementById('password')?.classList.add('invalidInput');
      document.getElementById('passwordLabel')?.classList.add('invalidLabel');
      if (this.passwordControl?.hasError('required')) {
        this.passwordErrorMessages = 'Password is required';
      } else if (this.passwordControl?.hasError('minlength')) {
        this.passwordErrorMessages = 'Password must be at least 8 characters';
      }
    } else {
      document.getElementById('password')?.classList.remove('invalidInput');
      document
        .getElementById('passwordLabel')
        ?.classList.remove('invalidLabel');
      this.passwordErrorMessages = '';
    }
  }

  ngOnInit(): void {
    this.emailControl?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.checkEmailErrors();
      });

    this.passwordControl?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.checkPasswordErrors();
      });
  }
}
